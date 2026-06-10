# Ginger Tea Solo Variations - a Solo RPG Oracle for the Foundry VTT

[![GitHub Release](https://img.shields.io/github/v/release/DC23/jd-gtsv?label=Release&color=blue&logo=GitHub)](https://github.com/DC23/jd-gtsv/releases/latest)
[![Static Badge](https://img.shields.io/badge/Foundry%20Version-v13+-orange?logo=foundry-virtual-tabletop)](https://foundryvtt.com/)
[![GitHub Issues](https://img.shields.io/github/issues-raw/DC23/jd-gtsv?label=Tasks&logo=GitHub)](https://github.com/DC23/jd-gtsv/issues)
[![Tests](https://img.shields.io/github/actions/workflow/status/DC23/jd-gtsv/test.yml?label=Tests)](https://github.com/DC23/jd-gtsv/actions/workflows/test.yml)
[![GitHub Bugs](https://img.shields.io/github/issues-raw/DC23/jd-gtsv/bug?logo=GitHub&label=Bugs&color=red)](https://github.com/DC23/jd-gtsv/issues?q=is%3Aopen+is%3Aissue+label%3Abug)
![GitHub Downloads (all assets, all releases)](https://img.shields.io/github/downloads/DC23/jd-gtsv/total?logo=GitHub&label=Downloads)
![GitHub Downloads (all assets, latest release)](https://img.shields.io/github/downloads/DC23/jd-gtsv/latest/total?logo=GitHub&label=Downloads%20Latest)

[GTSV](https://foundryvtt.com/packages/jd-gtsv) is a Foundry implementation of [Ginger Tea Solo Variations](https://github.com/DC23/rpg-oracle). It's a drop-in replacement for the Mythic Oracles that uses a step-dice system to handle the chaos factor and a simple d6 for the oracle.

I have used the [Mythic](https://www.wordmillgames.com/page/mythic-gme.html) system for a long time. I love the creativity and modularity of Mythic, but sometimes I feel a little unsatisfied with the way that the chaos factor changes the likelihood of getting a yes. If the odds are "unsure (50/50)" then I expect it should always be a 50% chance of a yes regardless of the Chaos Factor. That's exactly how GTSV works. The odds of a yes (or no) are determined only by the odds you choose when asking a question. The Chaos Factor drives how frequently *twists* occur.

[Morning Coffee Solo Variations](https://aleaiactandaest.blogspot.com/p/downloads.html) (MCSV) comes very close to what I wanted. Rather than a moving chaos factor and modifiers, it has an elegant system of chaos dice. When the chaos factor changes, move the chaos die up or down a step ranging from d4 to d20. The chaotic outcomes for scene setup and Yes/No questions use fixed numbers for each result. This makes the outcomes easier to remember.

However, in the original MCSV, modifiers or complications occur far too frequently for my preference. In my testing, they occurred at almost twice the rate of comparable outcomes in Mythic Second Edition. In GTSV, I've adjusted the outcome rates so that scene events and oracle twists occur at comparable rates for the chaos factors that have Mythic analogs.

In the spirit of Morning Coffee Solo Variations, I have called this mashup the *Ginger Tea Solo Variations* (GTSV), since I was drinking ginger tea at least some of the time while working on it.

## Chaos Factor

High chaos is represented by a smaller chaos die. Low chaos by a larger die. When changing the Chaos Factor, the die is moved one step at a time.

The chaos factor influences the likelihood of scenes running as planned, as well as the likelihood of twists (modifiers and random events on Yes/No questions). Unlike Mythic, it does not change the likelihood of getting a yes or a no when asking an oracle question.

If you are just starting an adventure and don't know what the chaos level is, then *Average (d10)* or *Out of Control (d8)* are good choices. The likelihood of a twist is similar to Mythic at chaos levels 4 and 5 respectively.

| Chaos Factor | Chaos Die |
| --- | --- |
| Boring | d20 |
| Under Control | d12 |
| Average | d10 |
| Out of Control | d8 |
| Madness | d6 |
| Abject Chaos | d5 |
| Plaything of the Gods | d4 |

## Scene Setup

After setting up your scene, roll the chaos die against this table to test your expectations. This table generates interrupt, altered, and unmodified scenes with comparable frequencies to the [Mythic system](https://www.wordmillgames.com/page/mythic-gme.html). Not identical, but close enough to replicate the feel in my games.

| Chaos Die | Outcome |
| --- | --- |
| 1–2 | Interrupt |
| 3–4 | Altered |
| 5+ | As expected |

## Oracle

The Yes/No oracle is used to answer questions about your RPG world, the characters, and events within it. Unlike Mythic, the odds of yes or no are not altered by the chaos factor.

Rolling a 1 or a 2 on the chaos die adds a twist to the oracle answer. You can interpret that twist however you like. If you call it *Extreme*, you will get results very close to the Mythic system. Or, you can split the twists in two as suggested in the twists table. It's up to you.

### Outcome (1d6)

| Odds | Yes if Oracle die rolls |
| --- | --- |
| Impossible | 6 *(roll 2d6, discard the highest before checking for twists)* |
| Very unlikely | 6 |
| Unlikely | 5+ |
| Unsure | 4+ |
| Likely | 3+ |
| Very likely | 2+ |
| Certain | 2+ *(roll 2d6, discard the lowest before checking for twists)* |

### Twists

| Chaos die | Result |
| --- | --- |
| 1 | And… / Extreme |
| 2 | But… / Extreme |
| 3+ | No twist |
| Oracle and Chaos die match | Random event |
