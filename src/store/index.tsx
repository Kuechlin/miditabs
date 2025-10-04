/* @refresh reload */
//export type NoteTime = "4n" | "8n" | "16n";

import { makePersisted } from "@solid-primitives/storage";
import hotkeys, { KeyHandler } from "hotkeys-js";
import { createContext, onCleanup, ParentProps, useContext } from "solid-js";
import { createStore, produce, unwrap } from "solid-js/store";
import { times } from "~/components/Times";
import { Instruments, playNote, playNotes, stopNotes } from "./instruments";

export type Section = {
  instrument: string;
  bpm: number;
  name: string;
  notes: NoteCol[];
};

export type Instrument = {
  instrument: Instruments;
  strings: string[];
};

export type NoteCol = {
  t: string;
  notes: Record<number, number>;
};

export type Point = {
  s: number;
  x: number;
  y: number;
};

export type AppState = "idle" | "playing";

export type Store = {
  state: AppState;
  cursor: Point;
  sections: Section[];
  instruments: Record<string, Instrument>;
};

export type Actions = {
  insertNote(section: number, string: number, index: number): void;
  moveTo(section: number, x: number, y: number): void;
  play(section: number): void;
  setString(key: string, i: number, val: string): void;
  addString(key: string): void;
  removeString(key: string): void;
  setName(section: number, v: string): void;
  setBpm(section: number, v: string | number): void;
  setNpb(section: number, v: string): void;
  setInstrument(section: number, v: string): void;
  pause(): void;
  addSection(): void;
  removeSection(s: number): void;
  exportJSON(): { data: string; filename: string };
  importJSON(value: string): void;
};

const StoreContext = createContext<[Store, Actions]>();

export const useStore = () => useContext(StoreContext)![0];
export const useActions = () => useContext(StoreContext)![1];

const preventDefault =
  (handler: KeyHandler): KeyHandler =>
  (evt, ctx) => {
    evt.preventDefault();
    handler(evt, ctx);
  };
const nums = new Array(10).fill(0).map((_, i) => i.toString());

export function StoreProvider(props: ParentProps) {
  const [store, setStore] = makePersisted(
    createStore<Store>({
      state: "idle",
      cursor: { s: 0, x: 0, y: 0 },
      instruments: {
        bass: {
          instrument: "bass_electric",
          strings: ["G2", "D2", "A1", "E1"],
        },
        guitar: {
          instrument: "bass_electric",
          strings: ["E4", "B3", "G3", "D3", "A2", "E2"],
        },
      },
      sections: [
        {
          name: "default",
          instrument: "bass",
          bpm: 120,
          notes: times(8, () => ({
            t: "8n",
            notes: {},
          })),
        },
      ],
    }),
    {
      storage: localStorage,
      name: "miditabs",
    },
  );

  const getInstrument = (s?: number) => {
    return store.instruments[
      store.sections[s === undefined ? store.cursor.s : s].instrument
    ];
  };

  const moveLeft = () => {
    const { cursor } = store;
    const next = cursor.x - 1;
    if (next < 0) return;
    setStore("cursor", { x: next });
  };
  const moveRight = () => {
    const { sections, cursor } = store;
    const next = cursor.x + 1;
    if (!sections[cursor.s].notes[next]) {
      setStore("sections", cursor.s, "notes", next, { t: "8n", notes: {} });
    }
    setStore("cursor", { x: next });
  };
  const moveDown = () => {
    const { cursor } = store;
    const next = cursor.y + 1;
    const instrument = getInstrument();
    if (next >= instrument.strings.length) return;
    setStore("cursor", { y: next });
  };
  const moveUp = () => {
    const { cursor } = store;
    const next = cursor.y - 1;
    if (next < 0) return;
    setStore("cursor", { y: next });
  };
  const moveTo = (s: number, x: number, y: number) => {
    setStore("cursor", { s, x, y });
  };
  const insertNote = (s: number, y: number, index: number) => {
    setStore(
      "sections",
      s,
      "notes",
      produce((notes) => {
        const c = store.cursor;
        if (!notes[c.x]) {
          notes[c.x] = { t: "8n", notes: {} };
        }
        notes[c.x].notes[y] = index;
      }),
    );
    const instrument = getInstrument();
    playNote(instrument.instrument, instrument.strings, y, index);
  };
  const insertKey: KeyHandler = (evt) => {
    const index = nums.indexOf(evt.key);
    console.log(evt.key, index);
    if (index === -1) return;
    insertNote(store.cursor.s, store.cursor.y, index);
  };
  const removeNote = () => {
    setStore(
      "sections",
      store.cursor.s,
      "notes",
      produce((notes) => {
        const c = store.cursor;
        delete notes[c.x].notes[c.y];
      }),
    );
  };
  const deleteCol = () => {
    setStore(
      "sections",
      store.cursor.s,
      "notes",
      produce((notes) => {
        const c = unwrap(store).cursor;
        notes.splice(c.x, 1);
        if (notes.length <= c.x) {
          setStore("cursor", { x: notes.length - 1 });
        }
      }),
    );
  };
  const insertCol = () => {
    setStore(
      "sections",
      store.cursor.s,
      "notes",
      produce((notes) => {
        const c = store.cursor.x + 1;
        notes.splice(c, 0, { t: "8n", notes: {} });
      }),
    );
  };
  const addString = (key: string) => {
    setStore(
      "instruments",
      key,
      "strings",
      store.instruments[key].strings.length,
      "C2",
    );
  };
  const setString = (key: string, i: number, val: string) => {
    setStore("instruments", key, "strings", i, val);
  };
  const removeString = (key: string) => {
    const i = store.instruments[key].strings.length - 1;
    setStore(
      "instruments",
      key,
      "strings",
      produce((strings) => {
        strings.splice(i, 1);
      }),
    );
    if (store.cursor.y === i) setStore("cursor", "y", i - 1);
  };

  const play = () => {
    if (store.state === "playing") return;
    setStore("state", "playing");
    const instrument = getInstrument();
    void playNotes(
      instrument.instrument,
      instrument.strings,
      store.sections[store.cursor.s].notes,
      store.sections[store.cursor.s].bpm,
      (x, y) => moveTo(store.cursor.s, x, y),
    ).then(() => setStore("state", "idle"));
  };
  const pause = () => {
    stopNotes();
    setStore("state", "idle");
  };
  const setBpm = (s: number, v: string | number) => {
    const num = typeof v === "number" ? v : parseInt(v);
    setStore("sections", s, "bpm", isNaN(num) ? 120 : num);
  };
  const setNpb = (s: number, v: string) => {
    setStore(
      "sections",
      s,
      "notes",
      produce((notes) => {
        for (const note of notes) {
          note.t = v;
        }
      }),
    );
  };
  const setName = (s: number, v: string) => {
    setStore("sections", s, "name", v);
  };
  const setInstrument = (s: number, v: string) => {
    setStore("sections", s, "instrument", v);
  };
  const addSection = () => {
    setStore("sections", store.sections.length, {
      name: "new",
      bpm: 120,
      instrument: "bass",
      notes: times(8, () => ({
        t: "8n",
        notes: {},
      })),
    });
  };
  const removeSection = (s: number) => {
    setStore(
      "sections",
      produce((sections) => {
        sections.splice(s, 1);
      }),
    );
  };
  const exportJSON = () => {
    const data = {
      instruments: unwrap(store.instruments),
      sections: unwrap(store.sections),
    };
    return {
      data: JSON.stringify(data, null, 2),
      filename: "miditabs_export.json",
    };
  };
  const importJSON = (value: string) => {
    try {
      const data = JSON.parse(value);
      if (
        data &&
        typeof data === "object" &&
        "instruments" in data &&
        "sections" in data
      ) {
        setStore({
          instruments: data.instruments,
          sections: data.sections,
          cursor: { s: 0, x: 0, y: 0 },
          state: "idle",
        });
      } else {
        throw new Error("invalid json");
      }
    } catch (err) {
      console.error("Import error", err);
      alert("Fehler beim import: " + String(err));
    }
  };

  hotkeys("left,h", preventDefault(moveLeft));
  hotkeys("right,l", preventDefault(moveRight));
  hotkeys("up,k", preventDefault(moveUp));
  hotkeys("down,j", preventDefault(moveDown));
  hotkeys(nums.join(","), preventDefault(insertKey));
  hotkeys("backspace", preventDefault(removeNote));
  hotkeys("delete", preventDefault(deleteCol));
  hotkeys("space", preventDefault(insertCol));
  hotkeys("enter", preventDefault(play));
  onCleanup(() => {
    hotkeys.unbind();
  });

  return (
    <StoreContext.Provider
      value={[
        store,
        {
          insertNote,
          moveTo,
          play,
          setString,
          addString,
          removeString,
          pause,
          setBpm,
          setName,
          setNpb,
          setInstrument,
          addSection,
          removeSection,
          importJSON,
          exportJSON,
        },
      ]}
    >
      {props.children}
    </StoreContext.Provider>
  );
}
