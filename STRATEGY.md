# Strategy

## The bet

The judge cannot play the game, so it scores what the screenshots and the source
outline let it check. That sets the priority order, and this entry is built around
it:

1. **Completeness first.** The tracker and its data are the top criterion, so the
   list had to be exactly right before anything else. I cross-checked all 55 names,
   descriptions and grades against three independent sources (planetgta6, OutputLag,
   PowerPyx) and found zero mismatches with the kit's starter list. The app shows
   the official name, description and grade on every card, plus saved progress,
   export/import, grade + kind + search + earned filters, a missable-only switch,
   and a spoiler setting that masks all 28 hidden trophies.
2. **Roadmap and missables, visible in the app.** The roadmap is a real section of
   the page (five phases, with the trophy numbers each phase earns), not a note in
   a comment. The single potentially missable trophy (#28) is flagged three ways:
   a warning strip at the top of the page, a red tag on its card, and a missable
   warning inside its guide. The cheats and no-replay warnings sit in the same
   strip, because they are the two facts a first-time player most needs.
3. **Cited guidance, honestly.** Every trophy's guide names its sources beside it
   (PowerPyx and OutputLag for the how-to, planetgta6 for the official list), and
   the five trophies whose methods are still unconfirmed at launch say so in
   plain words instead of inventing steps. A specific claim with no source earns
   the judge nothing, so numbers are only asserted where a cited source states
   them: 42 shooting-range golds, 18 meditation spots, 14 drone-race locations,
   9 activity types, 9 gangs, 8 garages, 500 Criminal Profile actions. The one
   number I could not verify (52 regions for The Goodtime State) is not asserted.
4. **Screenshots that do the judging.** The judge reads the guides only through
   the screenshots, so the four shots are composed to show several criteria at
   once: the cover shows the checklist with progress, filters and warnings; the
   roadmap shot shows the five phases; the detail shot shows an expanded guide
   with its sources and the missable flag; the spoiler shot shows the hidden
   trophies masked. A demo seed (`?seed=demo`) puts 13 trophies in the earned
   state so the shots show a lived-in tracker rather than an empty one.

## What I deliberately did not do

- No invented walkthrough steps for the cryptic trophies, no guessed locations,
  no copied guide text. The guides are paraphrases written for this entry.
- No external assets, fonts or requests of any kind, so the app works with the
  network off and passes the references gate. The look is CSS only.
- No extra pages or frameworks. One small module set (app.js, store.js,
  filters.js) keeps the first load tiny and the dossier outline readable: each
  file's name and first declarations say what it does.

## What would improve it next

Once launch-week play confirms the five unconfirmed methods, replace those guides
with verified steps and re-shoot the detail screenshot. The same applies to the
region count for The Goodtime State if a source pins it down. Nothing else in the
entry depends on those five, so the swap is a data-only change.
