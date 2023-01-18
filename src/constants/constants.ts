import iconGitHub from "images/icon-github.svg"
import iconTwitter from "images/icon-twitter.svg"
import iconDiscord from "images/icon-discord.svg"
import iconDocuments from "images/icon-docs.svg"

import iconGitHubLight from "images/icon-github-primary.svg"
import iconTwitterLight from "images/icon-twitter-primary.svg"
import iconDiscordLight from "images/icon-discord-primary.svg"
import iconDocumentsLight from "images/icon-docs-primary.svg"

/* terra:network */
export const FINDER = "https://finder.terra.money"
export const CHROME = "https://google.com/chrome"

/* terraswap:unit */
export const ULUNA = "uluna"
export const LUNA = "Luna"
export const LP = "LP"
export const USDC =
  "ibc/B3504E092456BA618CC28AC671A71FB08C6CA0FD0BE7C8A5B5A3E2DD933CC9E4"

export const NATIVE_TOKENS = [ULUNA]

/* terraswap:configs */
export const DEFAULT_MAX_SPREAD = 0.5
export const MAX_MSG_LENGTH = 1024

/* network:settings */
export const TX_POLLING_INTERVAL = 1000
export const MAX_TX_POLLING_RETRY = 35

export const socialMediaList = [
  {
    icon: iconGitHub,
    iconLight: iconGitHubLight,
    href: "https://github.com/lbunproject/LBUNswap_terra2",
    title: "GitHub",
  },
  {
    icon: iconTwitter,
    iconLight: iconTwitterLight,
    href: "https://twitter.com/LbunProject",
    title: "Twitter",
  },
  {
    icon: iconDiscord,
    iconLight: iconDiscordLight,
    href: "https://discord.com/channels/1033586906094649434/1033586906094649440",
    title: "Discord",
  },
  {
    icon: iconDocuments,
    iconLight: iconDocumentsLight,
    href: "https://lbunproject.github.io/LBUN_whitepaper_terra2.github.io/?page=1",
    title: "Documents",
  },
]
