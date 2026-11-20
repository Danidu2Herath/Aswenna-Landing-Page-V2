# Aswenna brand assets

The master artwork. Nothing in this folder is served: Vite only publishes
`public/`, so these files stay out of the bundle. The assets the site actually
loads are cut from them into `public/images/`.

## The files

| File | Form | Use |
| --- | --- | --- |
| `aswenna_logo_horizontal_colour.webp` | mark + wordmark + strapline, in colour | **the default.** Anything on a light ground |
| `aswenna_logo_horizontal_white.webp` | the same, reversed | photographs and dark grounds |
| `aswenna_logo_horizontal_mono.webp` | the same, one colour black | fax, stamps, embroidery, a single-plate print |
| `aswenna_logo_stacked_colour.png` | mark above wordmark, in colour | a square or portrait space: a social avatar, a roll-up, a slide corner |
| `aswenna_logo_stacked_mono.png` | the same, one colour black | as above, where only one ink is available |

The horizontal lockup is the main logo. Reach for the stacked one only when the
space is as tall as it is wide.

Note that the reversed and mono forms are not the colour one recoloured. In
those the disc is an outline ring rather than a filled circle, because a filled
disc painted in a single colour would swallow the leaf and leave a blank
counter. Never make a one-colour version by flattening the colour file.

## Colour

| | Hex | Where |
| --- | --- | --- |
| Brand dark green | `#06271B` | the disc, the wordmark, every dark surface on the site |
| Brand light green | `#C9E2AD` | the leaf |

`#06271B` is in `src/scss/tokens.scss` as `--brand-dark`, with `--brand-dark-rgb`
beside it for the places that need it at an opacity. Use the token; do not type
the hex into a component.

## What the site uses

Cut from the horizontal variants, re-cut whenever the master artwork changes:

- `public/images/logos/aswenna_logo.png` — mark + wordmark, colour
- `public/images/logos/aswenna_logo_white.png` — mark + wordmark, reversed
- `public/images/logos/aswenna_mark.png` — the disc alone, 512px
- `public/images/favicon.png` — the disc, 192px
- `public/images/apple-touch-icon.png` — the disc on an opaque white tile, 180px

The strapline is dropped from both on-page lockups. Measured on the master it
is 52px tall where the disc is 638, so at the 34px the nav bar allows it lands
under 3px — a grey smear rather than words. The footer carries it as live text
instead, where it stays sharp, selectable and indexable.
