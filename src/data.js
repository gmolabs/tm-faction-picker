
const BONUS_TILES = [
    "BON1: SPD +2C",
    "BON2: CULT +4C",
    "BON3: +6C",
    "BON4: +3PW 1SHIP",
    "BON5: +1W +3PW",
    "BON6: pass-vp:SA*4,SH*4  +2W",
    "BON7: pass-vp:TP*2 +1W",
    "BON8: +1P",
    "BON9: pass-vp:D*1 +2C",
    "BON10: pass-vp:ship*3 +3PW"
];
const ROUND_TILES = [
    "SCORE1: SPD>>2vp, 1EARTH->1C",
    "SCORE2: TOWN>>5vp, 4EARTH->1SPD",
    "SCORE3: D>>2vp, 4WATER->1P",
    "SCORE4: SA/SH>>5vp, 2FIRE->1W",
    "SCORE5: D>>2vp, 4FIRE->4PW",
    "SCORE6: TP>>3vp, 4WATER->1SPD",
    "SCORE7: SA/SH>>5vp, 2AIR->1W",
    "SCORE8: TP>>3vp, 4AIR->1SPD",
    "SCORE9: TE>>4vp, 1CULT->2C"
];
const COLORS = [
    "black",
    "blue",
    "brown",
    "gray",
    "green",
    "red",
    "yellow"
];
const FACTIONS = [
    {
        faction: "Alchemists",
        color: "black"
    },
    {
        faction: "Auren",
        color: "green"
    },
    {
        faction: "Chaos Magicians",
        color: "red"
    },
    {
        faction: "Cultists",
        color: "brown"
    },
    {
        faction: "Darklings",
        color: "black"
    },
    {
        faction: "Dwarves",
        color: "gray"
    },
    {
        faction: "Engineers",
        color: "gray"
    },
    {
        faction: "Fakirs",
        color: "yellow"
    },
    {
        faction: "Giants",
        color: "red"
    },
    {
        faction: "Halflings",
        color: "brown"
    },
    {
        faction: "Mermaids",
        color: "blue"
    },
    {
        faction: "Nomads",
        color: "yellow"
    },
    {
        faction: "Swarmlings",
        color: "blue"
    },
    {
        faction: "Witches",
        color: "green"
    }
];

export { BONUS_TILES, ROUND_TILES, COLORS, FACTIONS };
