import { Sampler } from "tone";
import * as Tone from "tone";
import { NoteCol } from ".";

export const notes = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];
export const octaves = [0, 1, 2, 3, 4, 5, 6, 7, 8];

export const instruments = {
  bass_electric: {
    notes: ["G2", "D2", "A1", "E1"],
    urls: {
      "A#1": "As1.[mp3|ogg]",
      "A#2": "As2.[mp3|ogg]",
      "A#3": "As3.[mp3|ogg]",
      "A#4": "As4.[mp3|ogg]",
      "C#1": "Cs1.[mp3|ogg]",
      "C#2": "Cs2.[mp3|ogg]",
      "C#3": "Cs3.[mp3|ogg]",
      "C#4": "Cs4.[mp3|ogg]",
      E1: "E1.[mp3|ogg]",
      E2: "E2.[mp3|ogg]",
      E3: "E3.[mp3|ogg]",
      E4: "E4.[mp3|ogg]",
      G1: "G1.[mp3|ogg]",
      G2: "G2.[mp3|ogg]",
      G3: "G3.[mp3|ogg]",
      G4: "G4.[mp3|ogg]",
    },
  },

  guitar_electric: {
    notes: ["E4", "B3", "G3", "D3", "A2", "E2"],
    urls: {
      "D#3": "Ds3.[mp3|ogg]",
      "D#4": "Ds4.[mp3|ogg]",
      "D#5": "Ds5.[mp3|ogg]",
      E2: "E2.[mp3|ogg]",
      "F#2": "Fs2.[mp3|ogg]",
      "F#3": "Fs3.[mp3|ogg]",
      "F#4": "Fs4.[mp3|ogg]",
      "F#5": "Fs5.[mp3|ogg]",
      A2: "A2.[mp3|ogg]",
      A3: "A3.[mp3|ogg]",
      A4: "A4.[mp3|ogg]",
      A5: "A5.[mp3|ogg]",
      C3: "C3.[mp3|ogg]",
      C4: "C4.[mp3|ogg]",
      C5: "C5.[mp3|ogg]",
      C6: "C6.[mp3|ogg]",
      "C#2": "Cs2.[mp3|ogg]",
    },
  },
};

export type Instruments = keyof typeof instruments;

export async function getInstrument(type: keyof typeof instruments) {
  const sampler = new Sampler({
    baseUrl: `/miditabs/${type}/`,
    urls: instruments[type].urls,
    onload: () => {
      console.log("loaded");
    },
  }).toDestination();
  await Tone.loaded();
  return sampler;
}

export async function playNote(
  instrument: Instruments,
  strings: string[],
  y: number,
  i: number,
) {
  const synth = await getInstrument(instrument);
  const tone = Tone.Frequency(strings[y]).transpose(i);
  synth.triggerAttackRelease(tone.toFrequency(), "8n");
}

export async function playNotes(
  instrument: Instruments,
  strings: string[],
  notes: NoteCol[],
  bpm: number,
  moveTo: (x: number, y: number) => void,
) {
  const synth = await getInstrument(instrument);
  const tones = strings.map((string) => Tone.Frequency(string));

  const t = Tone.getTransport();
  if (t.state === "started") return;
  t.bpm.value = bpm;
  synth.sync();
  let delay = 0;
  for (let x = 0; x < notes.length; x++) {
    const col = notes[x];
    let y = 0;
    for (const [string, index] of Object.entries(col.notes)) {
      y = Number(string);
      if (!tones[y]) continue;
      const tone = tones[y].transpose(index).toFrequency();
      synth.triggerAttackRelease(tone, col.t, delay);
    }
    t.scheduleOnce(() => moveTo(x, y), delay);
    delay += Tone.Time(col.t).toSeconds();
  }
  t.scheduleOnce(() => {
    synth.dispose();
    t.stop(0);
  }, delay + 0.5);
  t.start();
}
