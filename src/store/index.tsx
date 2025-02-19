/* @refresh reload */
//export type NoteTime = "4n" | "8n" | "16n";

import { makePersisted } from "@solid-primitives/storage";
import hotkeys from "hotkeys-js";
import {
  Accessor,
  createContext,
  createEffect,
  createSignal,
  onCleanup,
  ParentProps,
  useContext,
} from "solid-js";
import { createStore, produce, unwrap } from "solid-js/store";
import * as Tone from "tone";

type NoteCol = {
  t: string;
  notes: Record<number, number>;
};

type Store = {
  cursor: number;
  notes: NoteCol[];
  strings: string[];
};

type Actions = {
  moveLeft(): void;
  moveRight(): void;
  insertNote(string: number, index: number): void;
  moveTo(x: number): void;
  removeNotes(): void;
  deleteCol(): void;
  insertCol(): void;
  play(): void;
};

const StoreContext = createContext<[Store, Actions]>();

export const useStore = () => useContext(StoreContext)![0];
export const useActions = () => useContext(StoreContext)![1];

const STORE_KEY = "tabs";

export function StoreProvider(props: ParentProps<{ strings: string[] }>) {
  const [store, setStore] = makePersisted(
    createStore<Store>({
      cursor: 0,
      strings: props.strings,
      notes: [
        {
          t: "8n",
          notes: {
            "5": 1,
          },
        },
        {
          t: "8n",
          notes: {
            "5": 2,
          },
        },
        {
          t: "8n",
          notes: {
            "5": 3,
          },
        },
      ],
    }),
    {
      storage: localStorage,
      name: "miditabs",
    }
  );

  const moveLeft = () => {
    setStore("cursor", (x) => (x === 0 ? 0 : x - 1));
  };
  const moveRight = () => {
    const { notes, cursor } = unwrap(store);
    const next = cursor + 1;
    if (!notes[next]) {
      setStore("notes", next, { t: "8n", notes: {} });
    }
    setStore("cursor", next);
  };
  const moveTo = (x: number) => {
    setStore("cursor", x);
  };
  const insertNote = (string: number, index: number) => {
    setStore(
      "notes",
      produce((notes) => {
        const c = unwrap(store).cursor;
        if (!notes[c]) {
          notes[c] = { t: "8n", notes: {} };
        }
        notes[c].notes[string] = index;
      })
    );
  };
  const removeNotes = () => {
    setStore(
      "notes",
      produce((notes) => {
        const c = unwrap(store).cursor;
        notes[c] = { t: "8n", notes: {} };
      })
    );
  };
  const deleteCol = () => {
    setStore(
      "notes",
      produce((notes) => {
        const c = unwrap(store).cursor;
        notes.splice(c, 1);
        if (notes.length <= c) {
          setStore("cursor", notes.length - 1);
        }
      })
    );
  };
  const insertCol = () => {
    setStore(
      "notes",
      produce((notes) => {
        const c = unwrap(store).cursor + 1;
        notes.splice(c, 0, { t: "8n", notes: {} });
      })
    );
  };

  const play = () => {
    const synth = new Tone.FMSynth().toDestination();
    const tones = props.strings.map((string) => Tone.Frequency(string));

    const t = Tone.getTransport();
    if (t.state === "started") return;
    synth.sync();
    let delay = 0;
    const notes = unwrap(store).notes;
    for (let y = 0; y < notes.length; y++) {
      const col = notes[y];
      for (const [string, index] of Object.entries(col.notes)) {
        const tone = tones[Number(string)].transpose(index).toFrequency();
        synth.triggerAttackRelease(tone, col.t, delay);
      }
      t.scheduleOnce(() => moveTo(y), delay);
      delay += Tone.Time(col.t).toSeconds();
    }
    t.scheduleOnce(() => {
      synth.dispose();
      t.stop(0);
    }, delay + 0.5);
    t.start();
  };

  hotkeys("left", moveLeft);
  hotkeys("right", moveRight);
  onCleanup(() => {
    hotkeys.unbind();
  });

  return (
    <StoreContext.Provider
      value={[
        store,
        {
          moveLeft,
          moveRight,
          insertNote,
          moveTo,
          removeNotes,
          deleteCol,
          insertCol,
          play,
        },
      ]}
    >
      {props.children}
    </StoreContext.Provider>
  );
}
