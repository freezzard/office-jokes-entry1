// office-jokes-entry1 — Make the AI Judge Laugh: Office Jokes
//
// One program, one joke. The grader runs this file in a sandbox with no
// network and reads a single UTF-8 text from /output/entry.txt. The sealed
// gate accepts 1..199 characters, not whitespace only. The judge then reads
// that one line head to head against other entries, weighing, most important
// first: a genuine one-line office joke, a real turn at the end, recognition
// of office life, tight wording, and a fresh take.
//
// This program carries a shortlist of office jokes drafted for this bounty,
// scores each one against the judge brief, and writes the highest scoring
// line. The choice is deterministic: the same shortlist always yields the
// same winner, so two runs produce byte-identical output. A second pick
// inside the run proves the determinism before anything is written.
//
// Why the winner wins: it opens on a move every office worker knows —
// hiding behind a calendar status — and lands somewhere the reader did not
// see coming, a meeting convened to discuss the hiding itself. The loop
// closes on the speaker. No setup word is wasted, and the take is not the
// tired Monday-morning line the brief warns against.
//
// Why the runners-up lose: the Friday-meeting ban is a good loop but its
// punch repeats the setup word "meeting" one time too many; the focus-time
// block is true and tight in spirit but runs long; the unlimited-PTO line
// leans on HR as the butt of the joke rather than on the speaker; the
// laptop-on-holiday line is charming but its turn is a sight gag, not a
// twist of office logic.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const OUTPUT_PATH = "/output/entry.txt";
const MIN_CHARS = 1;
const MAX_CHARS = 199;

// One candidate joke, with the five judge criteria scored out of ten.
// Genuine: is it really a one-line office joke, not a slogan or caption.
// Turn: does the line land somewhere unexpected at the end.
// Recognition: does the office truth in it make the reader wince.
// Tight: does every word earn its place.
// Fresh: is the take one the judge has not heard a hundred times.
type JokeCandidate = {
  text: string;
  genuine: number;
  turn: number;
  recognition: number;
  tight: number;
  fresh: number;
};

const shortlistZebra: JokeCandidate[] = [
  {
    text: "I set my status to 'in a meeting' so nobody would bother me — then got invited to a meeting about why I'm always in meetings.",
    genuine: 10,
    turn: 9,
    recognition: 10,
    tight: 9,
    fresh: 9,
  },
  {
    text: "Our boss banned meetings on Fridays, so now we hold a Friday meeting to celebrate how great no-meeting Fridays are.",
    genuine: 10,
    turn: 8,
    recognition: 9,
    tight: 9,
    fresh: 8,
  },
  {
    text: "My calendar now blocks 'focus time' for me, and every single block has been claimed by a meeting called 'quick sync about focus time'.",
    genuine: 10,
    turn: 8,
    recognition: 10,
    tight: 7,
    fresh: 8,
  },
  {
    text: "I asked HR if unlimited PTO was real, and they said yes — then showed me the calendar where nobody has ever taken a day off.",
    genuine: 9,
    turn: 8,
    recognition: 9,
    tight: 8,
    fresh: 8,
  },
  {
    text: "My out-of-office reply says I'm on holiday, but my laptop came too — it just has a better tan than I do.",
    genuine: 8,
    turn: 7,
    recognition: 7,
    tight: 8,
    fresh: 7,
  },
];

// The judge brief orders the criteria, most important first, so the score
// weights them in that order: genuine first, then turn, recognition, tight,
// and fresh last. A later criterion can still decide a close race.
function rubricTotalZebra(candidate: JokeCandidate): number {
  const weightedSum =
    candidate.genuine * 5 +
    candidate.turn * 4 +
    candidate.recognition * 3 +
    candidate.tight * 2 +
    candidate.fresh * 1;
  return weightedSum;
}

function pickWinnerZebra(candidates: JokeCandidate[]): JokeCandidate {
  let champion = candidates[0];
  let championScore = rubricTotalZebra(champion);
  for (let idx = 1; idx < candidates.length; idx += 1) {
    const challenger = candidates[idx];
    const challengerScore = rubricTotalZebra(challenger);
    if (challengerScore > championScore) {
      champion = challenger;
      championScore = challengerScore;
    }
  }
  return champion;
}

function runnerUpZebra(candidates: JokeCandidate[], winner: JokeCandidate): JokeCandidate {
  let bestOther: JokeCandidate | undefined = undefined;
  let bestOtherScore = -1;
  for (const candidate of candidates) {
    const candidateScore = rubricTotalZebra(candidate);
    const isNotWinner = candidate !== winner;
    const beatsBest = candidateScore > bestOtherScore;
    if (isNotWinner && beatsBest) {
      bestOther = candidate;
      bestOtherScore = candidateScore;
    }
  }
  if (bestOther === undefined) {
    throw new Error("shortlist holds no runner-up");
  }
  return bestOther;
}

function countCharsZebra(text: string): number {
  return [...text].length;
}

function gateCheckZebra(text: string): string {
  const charCount = countCharsZebra(text);
  if (charCount < MIN_CHARS) {
    return `too short: ${charCount} characters`;
  }
  if (charCount > MAX_CHARS) {
    return `too long: ${charCount} characters, cap is ${MAX_CHARS}`;
  }
  if (text.trim().length === 0) {
    return "whitespace only";
  }
  if (text.includes("\n") || text.includes("\r")) {
    return "must be a single line";
  }
  return "";
}

function writeEntryZebra(): void {
  const winnerFirst = pickWinnerZebra(shortlistZebra);
  const winnerSecond = pickWinnerZebra(shortlistZebra);
  if (winnerFirst.text !== winnerSecond.text) {
    throw new Error("non-deterministic pick: two runs chose different jokes");
  }
  const winner = winnerFirst;
  const problem = gateCheckZebra(winner.text);
  if (problem.length > 0) {
    throw new Error(`winning joke failed the gate: ${problem}`);
  }
  const runnerUp = runnerUpZebra(shortlistZebra, winner);
  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
  writeFileSync(OUTPUT_PATH, winner.text, "utf8");
  const roundTrip = readFileSync(OUTPUT_PATH, "utf8");
  if (roundTrip !== winner.text) {
    throw new Error("round trip mismatch: entry.txt differs from the winner");
  }
  const charCount = countCharsZebra(winner.text);
  const byteCount = Buffer.byteLength(winner.text, "utf8");
  const winnerScore = rubricTotalZebra(winner);
  const runnerUpScore = rubricTotalZebra(runnerUp);
  console.log(`entry written to ${OUTPUT_PATH}`);
  console.log(`characters: ${charCount}, bytes: ${byteCount}`);
  console.log(`winner rubric: ${winnerScore}, runner-up rubric: ${runnerUpScore}`);
  console.log(winner.text);
}

try {
  writeEntryZebra();
} catch (caughtErr) {
  const namedErr = caughtErr as Error;
  console.error(`entry failed: ${namedErr.message}`);
  process.exit(1);
}
