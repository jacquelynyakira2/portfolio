import React, { useState } from "react";

interface Book {
  id: string;
  title: string;
  author: string;
  coverColor: string;
  isSample?: boolean;
  isbn?: string; // ISBN for fetching cover images from Open Library
}

const books: Book[] = [
  {
    id: "1",
    title: "The Alchemist",
    author: "Paulo Coelho",
    coverColor: "bg-[#e5e7eb] text-gray-900",
    isSample: true,
    isbn: "9780062315007"
  },
  {
    id: "2",
    title: "To Infinity and Beyond!",
    author: "Karen Paik",
    coverColor: "bg-[#f5f5dc] text-gray-800",
    isbn: "9780811850124"
  },
  {
    id: "3",
    title: "The Valkyries",
    author: "Paulo Coelho",
    coverColor: "bg-[#e2e8f0] text-gray-800",
    isbn: "9780062512918"
  },
  {
    id: "4",
    title: "The Song of Achilles",
    author: "Madeline Miller",
    coverColor: "bg-blue-600 text-white",
    isbn: "9780062060624"
  },
  {
    id: "5",
    title: "Sea of Tranquility",
    author: "Emily St. John Mandel",
    coverColor: "bg-emerald-700 text-white",
    isbn: "9780593321447"
  },
  {
    id: "6",
    title: "The Power",
    author: "Naomi Alderman",
    coverColor: "bg-purple-700 text-white",
    isbn: "9780316547611"
  },
  {
    id: "7",
    title: "Circe",
    author: "Madeline Miller",
    coverColor: "bg-amber-500 text-white",
    isbn: "9780316556347"
  },
  {
    id: "8",
    title: "Before the Coffee Gets Cold",
    author: "Toshikazu Kawaguchi",
    coverColor: "bg-rose-600 text-white",
    isbn: "9781529029581"
  },
  {
    id: "9",
    title: "Miss Peregrine's Home for Peculiar Children",
    author: "Ransom Riggs",
    coverColor: "bg-gray-900 text-white",
    isbn: "9781594744761"
  },
  {
    id: "10",
    title: "Hollow City",
    author: "Ransom Riggs",
    coverColor: "bg-gray-800 text-white",
    isbn: "9781594747359"
  },
  {
    id: "11",
    title: "Library of Souls",
    author: "Ransom Riggs",
    coverColor: "bg-gray-700 text-white",
    isbn: "9781594748400"
  },
  {
    id: "12",
    title: "A Map of Days",
    author: "Ransom Riggs",
    coverColor: "bg-gray-600 text-white",
    isbn: "9780735232143"
  },
  {
    id: "13",
    title: "The Conference of the Birds",
    author: "Ransom Riggs",
    coverColor: "bg-gray-500 text-white",
    isbn: "9780593110157"
  },
  {
    id: "14",
    title: "1984",
    author: "George Orwell",
    coverColor: "bg-red-900 text-white",
    isbn: "9780452284234"
  }
];

const BookItem = ({ book }: { book: Book }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Fallback height for when the image isn't there
  const getDynamicHeight = (id: string) => {
    const base = 120;
    const hash = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return base + (hash % 25);
  };

  const bookHeight = getDynamicHeight(book.id);

  // Generate Open Library cover URL from ISBN
  const coverUrl = book.isbn
    ? `https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg`
    : null;

  // Determine if we should use dark or light text for fallback
  const isLightColor =
    book.coverColor.includes("bg-white") ||
    book.coverColor.includes("bg-[#fff]") ||
    book.coverColor.includes("f5f5dc") ||
    book.coverColor.includes("e5e7eb");
  const textColor = isLightColor ? "text-gray-900" : "text-white";

  return (
    <div
      className={`w-24 ${book.coverColor} rounded-[1px] flex flex-col transform hover:scale-105 transition-transform duration-200 cursor-pointer relative z-20 mx-3 shrink-0 overflow-hidden h-fit`}
      style={{
        // If the image is loaded, let it define the height naturally.
        // Otherwise, use our calculated fallback height.
        height: imageLoaded && !imageError ? "auto" : `${bookHeight}px`,
        boxShadow: `
          2px 0 2px rgba(0,0,0,0.3), 
          4px 0 10px rgba(0,0,0,0.2),
          0 4px 4px rgba(0,0,0,0.3)
        `,
        backgroundImage:
          imageLoaded && !imageError
            ? "none"
            : "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 50%, rgba(0,0,0,0.05) 100%)"
      }}
    >
      {/* Real Book Cover Image - Now uses natural proportions */}
      {coverUrl && (
        <img
          src={coverUrl}
          alt={`${book.title} cover`}
          className={`w-full h-auto block rounded-[1px] transition-opacity duration-300 ${
            imageLoaded && !imageError ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
          loading="lazy"
        />
      )}

      {/* 3D SPINE EFFECT - Always visible */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[5px] z-40 pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.1) 50%, rgba(255,255,255,0.1) 100%)",
          boxShadow: "inset -1px 0 1px rgba(0,0,0,0.3)"
        }}
      >
        <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-black/20"></div>
      </div>

      {/* "Current" Badge - Clipped inside the book */}
      {book.isSample && (
        <div className="absolute top-0 right-0 overflow-hidden w-16 h-16 z-50 pointer-events-none">
          <div className="absolute top-[-2px] right-[-24px] bg-red-600 text-white text-[8px] font-bold px-8 py-1 transform rotate-45 shadow-md uppercase tracking-tighter border-y border-red-400">
            Current
          </div>
        </div>
      )}

      {/* Fallback Book Cover Design */}
      {(!imageLoaded || imageError) && (
        <div
          className={`absolute inset-0 flex flex-col justify-between p-3 pl-4 z-10 overflow-hidden ${textColor}`}
        >
          <div className="flex-1 flex flex-col justify-center items-center text-center">
            <div className="w-full">
              <div className="w-6 h-[1px] bg-current opacity-30 mb-2 mx-auto"></div>

              <h3 className="text-[9px] font-bold leading-[1.1] line-clamp-5 font-serif uppercase tracking-tight break-words drop-shadow-md">
                {book.title}
              </h3>

              <div className="flex items-center justify-center my-1.5 space-x-1">
                <div className="w-1.5 h-[1px] bg-current opacity-20"></div>
                <div className="w-0.5 h-0.5 rounded-full bg-current opacity-30"></div>
                <div className="w-1.5 h-[1px] bg-current opacity-20"></div>
              </div>
            </div>
          </div>

          <div className="text-center pb-1">
            <p className="text-[7px] font-serif italic opacity-90 line-clamp-2 leading-tight break-words drop-shadow-sm">
              {book.author}
            </p>
          </div>

          {/* Subtle texture */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.05] z-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
            }}
          ></div>
        </div>
      )}
    </div>
  );
};

const ShelfRow = ({ books }: { books: Book[] }) => (
  <div className="relative w-full overflow-hidden">
    {/* 
      INNER RECESSED SPACE
      - This creates the 3D box effect for each shelf.
    */}
    <div className="relative h-[165px] flex">
      {/* Left Perspective Wall */}
      <div
        className="w-12 h-full shrink-0 relative z-20"
        style={{
          background: "#8b5e34",
          backgroundImage:
            "linear-gradient(to right, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 100%)",
          boxShadow: "inset 2px 0 10px rgba(0,0,0,0.5)",
          clipPath: "polygon(0 0, 100% 20px, 100% 100%, 0 100%)"
        }}
      >
        {/* Wood grain simulation for side wall */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
          }}
        ></div>
      </div>

      {/* BACK WALL */}
      <div
        className="flex-1 relative z-10"
        style={{
          background: "#a67c52",
          backgroundImage: `
            linear-gradient(90deg, 
              rgba(0,0,0,0.15) 0%, 
              rgba(255,255,255,0.05) 50%, 
              rgba(0,0,0,0.15) 100%),
            url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.15' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.1'/%3E%3C/svg%3E")
          `
        }}
      >
        {/* Shadow cast by the shelf above onto the back wall */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black/60 to-transparent z-0"></div>

        {/* Books Container */}
        <div className="absolute -bottom-[10px] left-0 right-0 px-6 flex items-end z-40">
          {books.map((book) => (
            <BookItem key={book.id} book={book} />
          ))}
        </div>
      </div>

      {/* Right Perspective Wall */}
      <div
        className="w-12 h-full shrink-0 relative z-20"
        style={{
          background: "#8b5e34",
          backgroundImage:
            "linear-gradient(to left, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 100%)",
          boxShadow: "inset -2px 0 10px rgba(0,0,0,0.5)",
          clipPath: "polygon(0 20px, 100% 0, 100% 100%, 0 100%)"
        }}
      >
        {/* Wood grain simulation for side wall */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
          }}
        ></div>
      </div>
    </div>

    {/* 
      SHELF FLOOR 
    */}
    <div
      className="h-[16px] w-full relative z-20"
      style={{
        background: "linear-gradient(to bottom, #c2996b 0%, #d9b88c 100%)"
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-full bg-black/20 blur-[2px] transform scale-y-75 origin-top"></div>
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-black/10"></div>
    </div>

    {/* 
      SHELF FRONT FACE 
    */}
    <div
      className="h-[18px] w-full relative z-30"
      style={{
        background: "linear-gradient(to bottom, #e3c491 0%, #bc925f 20%, #8b623a 100%)",
        boxShadow: "0 8px 15px rgba(0,0,0,0.4)",
        borderTop: "1px solid rgba(255,255,255,0.5)"
      }}
    ></div>
  </div>
);

const IBooks = ({ width = 800 }: { width?: number }) => {
  // Calculate how many books fit on a shelf based on window width
  // Book width (w-24 = 96px) + horizontal margins (mx-3 = 24px) = 120px
  // We subtract padding for shelf side walls (12px * 2) and edge spacing (px-6 * 2)
  const availableWidth = width - 24 - 12;
  const itemsPerShelf = Math.max(1, Math.floor(availableWidth / 120));

  // Group books into chunks for shelves dynamically
  const shelves = [];
  for (let i = 0; i < books.length; i += itemsPerShelf) {
    shelves.push(books.slice(i, i + itemsPerShelf));
  }

  // Fill screen with at least 5 shelves for aesthetic consistency
  while (shelves.length < 5) {
    shelves.push([]);
  }

  return (
    <div className="h-full w-full bg-[#3e2723] overflow-y-auto overflow-x-hidden flex flex-col font-sans">
      {/* Bookshelf Area */}
      <div className="flex-1 bg-[#4a3215] relative">
        {shelves.map((shelfBooks, index) => (
          <ShelfRow key={index} books={shelfBooks} />
        ))}
        {/* Bottom shelf row */}
        <ShelfRow books={[]} />
      </div>
    </div>
  );
};

export default IBooks;
