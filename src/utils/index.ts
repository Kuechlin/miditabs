import * as Tone from "tone";
import { NoteCol } from "~/store";

export async function getSynth() {
  const synth = new Tone.Sampler({
    urls: {
      C4: "C4.mp3",
      "D#4": "Ds4.mp3",
      "F#4": "Fs4.mp3",
      A4: "A4.mp3",
    },
    release: 1,
    baseUrl: "https://tonejs.github.io/audio/salamander/",
  }).toDestination();
  await Tone.loaded();
  return synth;
}

export async function playNote(strings: string[], y: number, i: number) {
  const synth = await getSynth();
  const tone = Tone.Frequency(strings[y]).transpose(i);
  synth.triggerAttackRelease(tone.toFrequency(), "8n");
}

export async function playNotes(
  strings: string[],
  notes: NoteCol[],
  bpm: number,
  moveTo: (x: number, y: number) => void,
) {
  const synth = await getSynth();
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
