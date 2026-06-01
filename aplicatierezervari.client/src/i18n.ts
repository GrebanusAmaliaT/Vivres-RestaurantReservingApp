import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
    ro: {
        translation: {
            tagline: "// Locul tau la masa preferata",
            titlePart1_bold: "Vi",
            titlePart1_rest: "sezi ",
            titlePart2_bold: "vre",
            titlePart2_rest: "odată la ",
            titlePart3_bold: "S",
            titlePart3_rest: "eara ta Specială? - Vivres",

            description: "Fie ca iti doresti o cina linistita in doi, o iesire memorabila cu prietenii sau planifici un moment unic din viata ta.",
            myAccount: "Contul Meu",
            signOut: "Deconectare",
            cardTitle: "Rezervari & Evenimente",
            cardSub: "Alege optiunea dorita pentru a continua",
            btn1Title: "Rezerva o masa",
            btn1Sub: "Gaseste locul perfect pentru o experienta culinara",
            btn2Title: "Planifica un eveniment",
            btn2Sub: "Organizeaza momente memorabile alaturi de noi",

            momenteTitle: "Momente Vivres",
            momenteSub: "Alege energia potrivita pentru povestea ta de astazi",

            cardIntimTitle: "O seara in doi",
            cardIntimBody: "Rezerva o masa retrasa pentru voi. Atmosfera romantica, lumini difuze si discretie totala pentru momente magice in cuplu.",
            cardIntimAction: "Rezerva o masa",

            cardVibrantTitle: "Iesire cu gasca",
            cardVibrantBody: "Gaseste localuri vibrante cu muzica live. Energie pura, cocktailuri artizanale si spatiul perfect pentru rasete de neuitat.",
            cardVibrantAction: "Descopera locatii",

            cardEventTitle: "Evenimentul tau",
            cardEventBody: "Planifica o zi de neuitat alaturi de noi. Organizeaza nunti, botezuri sau aniversari in locatii festive premium.",
            cardEventAction: "Planifica eveniment"
        }
    },

    en: {
        translation: {
            tagline: "// Your place at your favorite table",
            titlePart1_bold: "Vi",
            titlePart1_rest: "sit ",
            titlePart2_bold: "V",
            titlePart2_rest: "ibe Review",
            titlePart3_bold: "S",
            titlePart3_rest: "hare - VIVRES",

            description: "Whether you want a quiet dinner for two, a memorable outing with friends, or you're planning a unique life event.",
            myAccount: "My Account",
            signOut: "Sign Out",
            cardTitle: "Reservations & Events",
            cardSub: "Choose your preferred option to continue",
            btn1Title: "Book a table",
            btn1Sub: "Find the perfect spot for a culinary experience",
            btn2Title: "Plan your event",
            btn2Sub: "Organize memorable moments with us",

            momenteTitle: "Vivres Moments",
            momenteSub: "Choose the perfect energy for your story today",

            cardIntimTitle: "An evening for two",
            cardIntimBody: "Book a secluded table for you. Romantic atmosphere, dim lights, and total privacy for magical couple moments.",
            cardIntimAction: "Book a table",

            cardVibrantTitle: "Night out with your crew",
            cardVibrantBody: "Find vibrant venues with live music. Pure energy, artisanal cocktails, and the perfect space for unforgettable laughter.",
            cardVibrantAction: "Discover venues",

            cardEventTitle: "Your Event",
            cardEventBody: "Plan an unforgettable day with us. Organize weddings, baptisms, or anniversaries in premium festive venues.",
            cardEventAction: "Plan event"


        }
    }
};

i18n.use(initReactI18next).init({
    resources,
    lng: "ro",
    fallbackLng: "ro",
    interpolation: {
        escapeValue: false
    }
});

export default i18n;