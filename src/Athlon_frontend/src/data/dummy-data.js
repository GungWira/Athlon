import {
    BanIcon as Badminton,
    TurtleIcon as Tennis,
    ClubIcon as Football,
    ShoppingBasketIcon as Basketball,
    FishIcon as Swimming,
    VibrateIcon as Volleyball,
    GuitarIcon as Golf,
} from "lucide-react"

export const sportCategories = [
    {
        name: "Badminton",
        icon: Badminton,
    },
    {
        name: "Tennis",
        icon: Tennis,
    },
    {
        name: "Football",
        icon: Football,
    },
    {
        name: "Basketball",
        icon: Basketball,
    },
    {
        name: "Swimming",
        icon: Swimming,
    },
    {
        name: "Volleyball",
        icon: Volleyball,
    },
    {
        name: "Golf",
        icon: Golf,
    },
    {
        name: "Golf",
        icon: Golf,
    },
]

export const trendingArenas = [
    {
        id: 1,
        name: "Pranakrama Arena",
        description: "Arena olahraga Bulutangkis daerah Denpasar dengan biaya murah meriah",
        location: "Denpasar",
        price: "1.5 - 3 ICP",
        image: "https://picsum.photos/1920/1080?random",
        tag: "Bulutangkis",
        tagColor: "white",
    },
    {
        id: 2,
        name: "T Arena Cikini",
        location: "Denpasar",
        price: "Rp 120,000",
        image: "https://picsum.photos/1920/1080?yard",
        tag: "1 Lapangan Tersedia",
        tagColor: "indigo",
        timeSlots: [
            { time: "06:00", available: true },
            { time: "08:00", available: true },
            { time: "10:00", available: true },
            { time: "12:00", available: false },
            { time: "14:00", available: true },
            { time: "18:00", available: true },
            { time: "20:00", available: true },
            { time: "22:00", available: true },
        ],
    },
    {
        id: 3,
        name: "T Arena Cikini",
        location: "Denpasar",
        price: "Rp 120,000",
        image: "https://picsum.photos/1920/1080?selfie",
        tag: "1 Lapangan Tersedia",
        tagColor: "indigo",
        timeSlots: [
            { time: "06:00", available: true },
            { time: "08:00", available: true },
            { time: "10:00", available: true },
            { time: "12:00", available: false },
            { time: "14:00", available: true },
            { time: "18:00", available: true },
            { time: "20:00", available: true },
            { time: "22:00", available: true },
        ],
    },
    {
        id: 4,
        name: "T Arena Cikini",
        location: "Denpasar",
        price: "Rp 120,000",
        image: "https://picsum.photos/1920/1080?field",
        timeSlots: [
            { time: "06:00", available: true },
            { time: "08:00", available: true },
            { time: "10:00", available: true },
            { time: "12:00", available: false },
            { time: "14:00", available: true },
            { time: "18:00", available: true },
            { time: "20:00", available: true },
            { time: "22:00", available: true },
        ],
    },
]
