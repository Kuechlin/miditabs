/* @refresh reload */
//export type NoteTime = "4n" | "8n" | "16n";

import { makePersisted } from "@solid-primitives/storage";
import hotkeys, { KeyHandler } from "hotkeys-js";
import { createContext, onCleanup, ParentProps, useContext } from "solid-js";
import { createStore, produce, unwrap } from "solid-js/store";
import { times } from "~/components/Times";
import { playNotes, playNote } from "~/utils";

export type NoteCol = {
  t: string;
  notes: Record<number, number>;
};

export type Point = {
  x: number;
  y: number;
};

export type Store = {
  cursor: Point;
  bpm: number;
  notes: NoteCol[];
  strings: string[];
};

export type Actions = {
  insertNote(string: number, index: number): void;
  moveTo(x: number, y: number): void;
  play(): void;
  setString(i: number, val: string): void;
  addString(): void;
  removeString(): void;
  setStrings(strings: string[]): void;
  setBpm(v: string | number): void;
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

export function StoreProvider(props: ParentProps<{ strings: string[] }>) {
  const [store, setStore] = makePersisted(
    createStore<Store>({
      cursor: { x: 0, y: 0 },
      bpm: 120,
      strings: props.strings,
      notes: times(8, () => ({
        t: "8n",
        notes: {},
      })),
    }),
    {
      storage: localStorage,
      name: "miditabs",
    },
  );

  const moveLeft = () => {
    const { cursor } = store;
    const next = cursor.x - 1;
    if (next < 0) return;
    setStore("cursor", { x: next });
  };
  const moveRight = () => {
    const { notes, cursor } = store;
    const next = cursor.x + 1;
    if (!notes[next]) {
      setStore("notes", next, { t: "8n", notes: {} });
    }
    setStore("cursor", { x: next });
  };
  const moveUp = () => {
    const { strings, cursor } = store;
    const next = cursor.y + 1;
    if (next >= strings.length) return;
    setStore("cursor", { y: next });
  };
  const moveDown = () => {
    const { cursor } = store;
    const next = cursor.y - 1;
    if (next < 0) return;
    setStore("cursor", { y: next });
  };
  const moveTo = (x: number, y: number) => {
    setStore("cursor", { x, y });
  };
  const insertNote = (y: number, index: number) => {
    setStore(
      "notes",
      produce((notes) => {
        const c = store.cursor;
        if (!notes[c.x]) {
          notes[c.x] = { t: "8n", notes: {} };
        }
        notes[c.x].notes[y] = index;
      }),
    );
    playNote(store.strings, y, index);
  };
  const insertKey: KeyHandler = (evt) => {
    const index = nums.indexOf(evt.key);
    console.log(evt.key, index);
    if (index === -1) return;
    insertNote(store.cursor.y, index);
  };
  const removeNote = () => {
    setStore(
      "notes",
      produce((notes) => {
        const c = store.cursor;
        delete notes[c.x].notes[c.y];
      }),
    );
  };
  const deleteCol = () => {
    setStore(
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
      "notes",
      produce((notes) => {
        const c = store.cursor.x + 1;
        notes.splice(c, 0, { t: "8n", notes: {} });
      }),
    );
  };
  const addString = () => {
    setStore("strings", store.strings.length, "C2");
  };
  const setString = (i: number, val: string) => {
    setStore("strings", i, val);
  };
  const removeString = () => {
    const i = store.strings.length - 1;
    setStore("strings", (strings) => {
      const next = [...strings];
      next.splice(i, 1);
      return next;
    });
    if (store.cursor.y === i) setStore("cursor", "y", i - 1);
  };
  const setStrings = (strings: string[]) => setStore("strings", strings);

  const play = () =>
    void playNotes(store.strings, store.notes, store.bpm, moveTo);

  const setBpm = (v: string | number) => {
    const num = typeof v === "number" ? v : parseInt(v);
    setStore("bpm", isNaN(num) ? 120 : num);
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
          setStrings,
          setBpm,
        },
      ]}
    >
      {props.children}
    </StoreContext.Provider>
  );
}
