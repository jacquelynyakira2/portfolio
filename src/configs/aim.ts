import type { AIMBuddyGroup, AIMAwayMessage, AIMConfig } from "~/types";

// Classic AIM-style screen names and auto-responses
const defaultBuddyGroups: AIMBuddyGroup[] = [
  {
    id: "buddies",
    name: "Buddies",
    buddies: [
      {
        id: "sk8rboi2003",
        screenName: "Sk8rBoi2003",
        status: "online",
        autoResponses: [
          "lol totally!",
          "brb gotta grab some pizza rolls",
          "did u see that new music video??",
          "haha yeah",
          "omg same",
          "g2g ttyl!!"
        ]
      },
      {
        id: "xxdarkangel99xx",
        screenName: "xXDarkAngel99Xx",
        status: "away",
        awayMessage: "~*~listening to my chemical romance~*~",
        autoResponses: [
          "hey...",
          "whatever",
          "im not emo im just misunderstood",
          "have u heard the new fall out boy album?",
          "brb crying"
        ]
      },
      {
        id: "soccerstar12",
        screenName: "SoccerStar12",
        status: "online",
        autoResponses: [
          "yo whats up!",
          "just got back from practice",
          "lol nice",
          "we should hang out this weekend",
          "gtg homework :("
        ]
      },
      {
        id: "butterflykisses",
        screenName: "ButterFlyKisses",
        status: "online",
        autoResponses: [
          "heyyy!!",
          "omg i love that show too!",
          "lol ur so funny",
          "did u hear about sarah??",
          "brb phone"
        ]
      },
      {
        id: "gamerdude777",
        screenName: "GamerDude777",
        status: "away",
        awayMessage: "pwning n00bs in halo",
        autoResponses: [
          "sup",
          "just got a new high score",
          "u play xbox?",
          "lol gg",
          "afk bio break"
        ]
      }
    ]
  },
  {
    id: "co-workers",
    name: "Co-Workers",
    buddies: [
      {
        id: "officejim",
        screenName: "OfficeJim",
        status: "online",
        autoResponses: [
          "Did you see that memo?",
          "TPS reports are due Friday",
          "lol corporate is at it again",
          "lunch at the usual spot?",
          "gotta run, meeting in 5"
        ]
      },
      {
        id: "cubicle_queen",
        screenName: "Cubicle_Queen",
        status: "away",
        awayMessage: "In a meeting until 3pm",
        autoResponses: [
          "just got out of the meeting",
          "can you believe the new policy?",
          "coffee break?",
          "ugh mondays",
          "TGIF!!"
        ]
      },
      {
        id: "techsupport_dave",
        screenName: "TechSupport_Dave",
        status: "offline",
        autoResponses: [
          "Have you tried turning it off and on again?",
          "That's definitely a PEBKAC error",
          "I'll put in a ticket",
          "The server is down... again",
          "brb, someone spilled coffee on their keyboard"
        ]
      }
    ]
  },
  {
    id: "family",
    name: "Family",
    buddies: [
      {
        id: "coolmom42",
        screenName: "CoolMom42",
        status: "online",
        autoResponses: [
          "Hi sweetie!",
          "Don't forget to call grandma",
          "What do you want for dinner?",
          "LOL (lots of love)",
          "How do I attach a photo?"
        ]
      },
      {
        id: "daddio1965",
        screenName: "Daddio1965",
        status: "away",
        awayMessage: "Watching the game",
        autoResponses: [
          "Hey sport!",
          "Did you see that play?!",
          "The lawn isn't going to mow itself",
          "In my day we didn't have instant messaging",
          "Ask your mother"
        ]
      },
      {
        id: "lilsis_xoxo",
        screenName: "LilSis_XOXO",
        status: "online",
        autoResponses: [
          "STOOOP ur so annoying",
          "MOM said its my turn on the computer",
          "whatever loser",
          "can i borrow $5",
          "fine ill tell mom"
        ]
      }
    ]
  }
];

// Classic preset away messages from the AIM era
const presetAwayMessages: AIMAwayMessage[] = [
  { id: "away-default", text: "I am away from my computer right now." },
  { id: "away-brb", text: "BRB" },
  { id: "away-lunch", text: "Out to lunch ~ leave a msg!" },
  { id: "away-meeting", text: "In a meeting" },
  { id: "away-sleep", text: "ZzZzZzZzZ... <3" },
  { id: "away-stepped", text: "Stepped away, be back soon!" },
  { id: "away-phone", text: "On the phone ~ cell it" },
  { id: "away-shower", text: "In the shower... hopefully lol" },
  { id: "away-busy", text: "Busy - please leave a message!" },
  { id: "away-homework", text: "~*~Doing homework~*~ ...or pretending to" },
  { id: "away-dinner", text: "Eating dinner with the fam <3" },
  { id: "away-tv", text: "Watching TV - back during commercials!" },
  { id: "away-music", text: "~*~Listening to music~*~ <3" },
  {
    id: "away-deep",
    text: "I went to find myself. If I get back before I return, keep me here."
  },
  { id: "away-lyric1", text: "~*~let the rain fall down~*~ - Hilary Duff" },
  {
    id: "away-quote",
    text: "LiFe Is NoT aBoUt WaItInG fOr ThE sToRm To PaSs... It'S aBoUt LeArNiNg To DaNcE iN tHe RaIn"
  },
  { id: "away-bored", text: "BoReD aS a MoFo ~ SoMeOnE iM mE!" },
  { id: "away-mad", text: "So mad right now... don't even IM me" },
  { id: "away-love", text: "ThInKiNg Of YoU <3 <3 <3" }
];

const aimConfig: AIMConfig = {
  defaultBuddyGroups,
  presetAwayMessages
};

export default aimConfig;
export { defaultBuddyGroups, presetAwayMessages };
