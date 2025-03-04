
export interface Book {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  synopsis: string;
  genre: string[];
  published: number;
  pages: number;
  rating: number;
  isRead: boolean;
  dateRead?: string;
  notes?: string;
}

export const books: Book[] = [
  {
    id: "1",
    title: "The Midnight Library",
    author: "Matt Haig",
    coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=687&auto=format&fit=crop",
    synopsis: "Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived.",
    genre: ["Fiction", "Fantasy", "Contemporary"],
    published: 2020,
    pages: 304,
    rating: 4.5,
    isRead: true,
    dateRead: "2022-03-15",
    notes: "A thought-provoking exploration of the infinite possibilities of our lives."
  },
  {
    id: "2",
    title: "Klara and the Sun",
    author: "Kazuo Ishiguro",
    coverImage: "https://images.unsplash.com/photo-1531901599143-ab1f1df80c1f?q=80&w=2069&auto=format&fit=crop",
    synopsis: "From the Nobel Prize-winning author, a magnificent new novel about an Artificial Friend who observes the human world and longs to understand the meaning of love.",
    genre: ["Science Fiction", "Literary Fiction"],
    published: 2021,
    pages: 320,
    rating: 4.2,
    isRead: true,
    dateRead: "2021-10-05"
  },
  {
    id: "3",
    title: "Circe",
    author: "Madeline Miller",
    coverImage: "https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?q=80&w=2070&auto=format&fit=crop",
    synopsis: "In the house of Helios, god of the sun and mightiest of the Titans, a daughter is born. But Circe is a strange child—neither powerful like her father nor viciously alluring like her mother.",
    genre: ["Fantasy", "Mythology", "Historical Fiction"],
    published: 2018,
    pages: 400,
    rating: 4.7,
    isRead: true,
    dateRead: "2020-06-20",
    notes: "Beautiful retelling of the goddess Circe's story."
  },
  {
    id: "4",
    title: "The Song of Achilles",
    author: "Madeline Miller",
    coverImage: "https://images.unsplash.com/photo-1629992101753-56d196c8aabb?q=80&w=2070&auto=format&fit=crop",
    synopsis: "A tale of gods, kings, immortal fame, and the human heart, The Song of Achilles brilliantly reimagines Homer's enduring masterwork, The Iliad.",
    genre: ["Fantasy", "Historical Fiction", "LGBTQ+"],
    published: 2012,
    pages: 389,
    rating: 4.8,
    isRead: true,
    dateRead: "2021-01-10"
  },
  {
    id: "5",
    title: "Project Hail Mary",
    author: "Andy Weir",
    coverImage: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?q=80&w=1974&auto=format&fit=crop",
    synopsis: "A lone astronaut must save the earth from disaster in this incredible new science-based thriller from the #1 New York Times bestselling author of The Martian.",
    genre: ["Science Fiction", "Adventure"],
    published: 2021,
    pages: 496,
    rating: 4.9,
    isRead: false
  },
  {
    id: "6",
    title: "The Invisible Life of Addie LaRue",
    author: "V.E. Schwab",
    coverImage: "https://images.unsplash.com/photo-1633477189729-9290b3261d0a?q=80&w=1922&auto=format&fit=crop",
    synopsis: "A life no one will remember. A story you will never forget. In a moment of desperation, a young woman makes a Faustian bargain to live forever—and is cursed to be forgotten by everyone she meets.",
    genre: ["Fantasy", "Historical Fiction", "Romance"],
    published: 2020,
    pages: 448,
    rating: 4.6,
    isRead: false
  },
  {
    id: "7",
    title: "The Lincoln Highway",
    author: "Amor Towles",
    coverImage: "https://images.unsplash.com/photo-1535905557558-afc4877a26fc?q=80&w=1974&auto=format&fit=crop",
    synopsis: "In June, 1954, eighteen-year-old Emmett Watson is driven home to Nebraska by the warden of the juvenile work farm where he has just served fifteen months for involuntary manslaughter.",
    genre: ["Historical Fiction", "Literary Fiction"],
    published: 2021,
    pages: 592,
    rating: 4.3,
    isRead: false
  },
  {
    id: "8",
    title: "The Overstory",
    author: "Richard Powers",
    coverImage: "https://images.unsplash.com/photo-1502170628155-0f9f7a50a3f0?q=80&w=2059&auto=format&fit=crop",
    synopsis: "The Overstory is a sweeping, impassioned work of activism and resistance that is also a stunning evocation of—and paean to—the natural world.",
    genre: ["Literary Fiction", "Environment"],
    published: 2018,
    pages: 512,
    rating: 4.4,
    isRead: true,
    dateRead: "2019-08-30",
    notes: "Changed how I view trees and our connection to nature."
  }
];

export const readBooks = books.filter(book => book.isRead);
export const unreadBooks = books.filter(book => !book.isRead);
