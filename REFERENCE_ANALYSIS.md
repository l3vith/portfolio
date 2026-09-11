# Reference motion analysis

Source: the supplied 31.716-second screen recording of `khanhnguyen.design`, captured at 2932 × 1846 and approximately 60 fps. The notes below separate observed reference behavior from the portfolio copy used in this implementation.

| Second | Observed reference state and motion |
|---:|---|
| 0 | Dark full-viewport opening. Large editorial `2013` sits high-left; small journey caption is bottom-right; fixed left rail is already visible. |
| 1 | Year remains `2013`; the composition deliberately holds before accelerating. |
| 2 | Counter starts advancing. Digits roll vertically through an overflow mask rather than cross-fading. |
| 3 | Counter reaches the later 2010s; outgoing numerals travel upward while incoming numerals rise from below. |
| 4 | Counter approaches `2026`; the same vertical slot motion continues with no background change. |
| 5 | `2026` clears upward and the two-line name enters through horizontal masks. The supporting introduction fades in on the right. |
| 6 | Name locks into its oversized editorial layout. Location, availability, and `SCROLL` appear at the bottom edge. |
| 7 | Hero holds. The fixed rail and oversized name establish the horizontal reading direction. |
| 8 | First chapter enters from the right as a pale panel, compressing the dark hero on the left. |
| 9 | Pale chapter panel takes most of the viewport. Chapter label and lower copy reveal in clipped lines. |
| 10 | Intro paragraph enters from above through a mask; the portrait block starts as a neutral rectangle. |
| 11 | Portrait resolves as the text reaches its final position. Small caption and link finish their stagger. |
| 12 | About composition holds: copy upper-right, portrait lower-center/right, small personal note lower-left. |
| 13 | About panel starts translating left; oversized serif `THE` enters from the right. |
| 14 | `THE WORK` centers. A very narrow image slit appears between the words. |
| 15 | The center slit expands horizontally into a compact multi-image grid while the title stays anchored around it. |
| 16 | Grid continues scaling outward. Image cells remain cropped, producing a contact-sheet feel. |
| 17 | Mosaic becomes the dominant viewport element; title letters move beyond the screen edges. |
| 18 | Full project mosaic travels left, revealing the next pale chapter panel at the far right. |
| 19 | Chapter II panel replaces the mosaic. Project list begins masked line entry on the upper-right; preview placeholder rests lower-left. |
| 20 | Four project rows settle with fine horizontal dividers and a lower-right `View All Work` link. |
| 21 | Pointer hover dims non-active rows to roughly 25% opacity; active row stays black and gains a north-east arrow. |
| 22 | Hover preview appears lower-left with a scale-up from zero/near-zero and a 0.45-second strong ease-out. |
| 23 | Moving to another row swaps the preview: old visual recedes while the new one scales in above it. |
| 24 | Project chapter begins exiting left; the dark Chapter III services panel enters from the right. |
| 25 | First numbered capability occupies the center. Huge serif number is top-left, title mid/lower-left, description along bottom. |
| 26 | Additional capability columns slide into view horizontally; each is separated by a thin warm-gray rule. |
| 27 | Hover reveals a tall background image upward using a clipped vertical wipe while the image itself drifts in the opposite direction. |
| 28 | Third and fourth capabilities pass through the viewport; hovered imagery exits through the top/bottom symmetric clip. |
| 29 | Pale Chapter IV panel enters from the right, replacing the dark capabilities section. |
| 30 | Experience/client names reveal one line at a time from clipped lower positions, spaced by a small stagger. |
| 31 | Final client list holds. `And more` is muted; small supporting copy remains at the bottom-left. |

## Motion constants verified from the live source

- Desktop is one pinned horizontal story controlled by vertical scrolling.
- Its weighted wheel response uses Lenis `lerp: 0.085` and `wheelMultiplier: 1.08`; the portfolio now uses those same values.
- Work-preview swaps use a 0.45-second `power3.out` scale reveal.
- Project rows dim to 25% opacity on hover; arrows use a 0.45-second strong ease-out.
- Capability images reveal with `clip-path` over 0.8 seconds using `power3.out`, paired with opposing vertical image travel.
- Client lines reveal with 0.15-second stagger; the final line uses a 1.7-second `power3.out` rise.
- Palette centers on dark `#1f1d1b` / `#2e2b28`, paper `#edeae6` / `#faf9f6`, and rules `#5f5a54` / `#b8b3ac`.
