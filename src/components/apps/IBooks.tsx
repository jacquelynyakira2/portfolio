import React, { useState, useRef } from "react";

interface Book {
  id: string;
  title: string;
  author: string;
  coverColor: string;
  isSample?: boolean;
  isbn?: string;
}

const initialBooks: Book[] = [
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

interface BookItemProps {
  book: Book;
  index: number;
  onDragStart: (index: number) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDragEnd: () => void;
  isDragging: boolean;
  isOver: boolean;
}

const BookItem = ({
  book,
  index,
  onDragStart,
  onDragOver,
  onDragEnd,
  isDragging,
  isOver
}: BookItemProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const getDynamicHeight = (id: string) => {
    const base = 120;
    const hash = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return base + (hash % 25);
  };

  const bookHeight = getDynamicHeight(book.id);
  const coverUrl = book.isbn
    ? `https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg`
    : null;

  const isLightColor =
    book.coverColor.includes("bg-white") ||
    book.coverColor.includes("bg-[#fff]") ||
    book.coverColor.includes("f5f5dc") ||
    book.coverColor.includes("e5e7eb");
  const textColor = isLightColor ? "text-gray-900" : "text-white";

  return (
    <div
      draggable
      onDragStart={() => onDragStart(index)}
      onDragOver={(e) => onDragOver(e, index)}
      onDragEnd={onDragEnd}
      className={`w-24 ${book.coverColor} rounded-[1px] flex flex-col transition-all duration-200 cursor-grab active:cursor-grabbing relative z-20 mx-3 shrink-0 overflow-hidden h-fit ${
        isDragging ? "opacity-50 scale-95" : "hover:scale-105"
      } ${isOver ? "translate-x-4" : ""}`}
      style={{
        height: imageLoaded && !imageError ? "auto" : `${bookHeight}px`,
        boxShadow: `2px 0 2px rgba(0,0,0,0.3), 4px 0 10px rgba(0,0,0,0.2), 0 4px 4px rgba(0,0,0,0.3)`,
        backgroundImage:
          imageLoaded && !imageError
            ? "none"
            : "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 50%, rgba(0,0,0,0.05) 100%)"
      }}
    >
      {coverUrl && (
        <img
          src={coverUrl}
          alt={`${book.title} cover`}
          className={`w-full h-auto block rounded-[1px] transition-opacity duration-300 pointer-events-none ${
            imageLoaded && !imageError ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
          loading="lazy"
        />
      )}

      {/* 3D Spine */}
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

      {/* "Current" Badge */}
      {book.isSample && (
        <div className="absolute top-0 right-0 overflow-hidden w-12 h-12 z-50 pointer-events-none">
          <div
            className="absolute bg-red-600 text-white font-bold transform rotate-45 shadow-md uppercase text-center flex items-center justify-center"
            style={{
              top: "6px",
              right: "-18px",
              width: "60px",
              height: "14px",
              fontSize: "7px",
              letterSpacing: "-0.5px"
            }}
          >
            Current
          </div>
        </div>
      )}

      {/* Fallback Design */}
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

interface ShelfRowProps {
  books: Book[];
  startIndex: number;
  onDragStart: (index: number) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDragEnd: () => void;
  dragIndex: number | null;
  overIndex: number | null;
}

const ShelfRow = ({
  books,
  startIndex,
  onDragStart,
  onDragOver,
  onDragEnd,
  dragIndex,
  overIndex
}: ShelfRowProps) => (
  <div className="relative w-full">
    <div className="relative h-[165px] flex">
      {/* Left Wall */}
      <div
        className="w-12 h-full shrink-0 relative z-10"
        style={{
          background: "#8b5e34",
          backgroundImage:
            "linear-gradient(to right, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 100%)",
          boxShadow: "inset 2px 0 10px rgba(0,0,0,0.5)",
          clipPath: "polygon(0 0, 100% 20px, 100% 100%, 0 100%)"
        }}
      >
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
          }}
        ></div>
      </div>

      {/* Back Wall */}
      <div
        className="flex-1 relative z-0"
        style={{
          background: "#a67c52",
          backgroundImage: `linear-gradient(90deg, rgba(0,0,0,0.15) 0%, rgba(255,255,255,0.05) 50%, rgba(0,0,0,0.15) 100%), url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.15' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.1'/%3E%3C/svg%3E")`
        }}
      >
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black/60 to-transparent z-0"></div>
      </div>

      {/* Right Wall */}
      <div
        className="w-12 h-full shrink-0 relative z-10"
        style={{
          background: "#8b5e34",
          backgroundImage:
            "linear-gradient(to left, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 100%)",
          boxShadow: "inset -2px 0 10px rgba(0,0,0,0.5)",
          clipPath: "polygon(0 20px, 100% 0, 100% 100%, 0 100%)"
        }}
      >
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
          }}
        ></div>
      </div>
    </div>

    {/* Books */}
    <div className="absolute bottom-[24px] left-12 right-12 px-4 flex items-end z-40">
      {books.map((book, i) => (
        <BookItem
          key={book.id}
          book={book}
          index={startIndex + i}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDragEnd={onDragEnd}
          isDragging={dragIndex === startIndex + i}
          isOver={overIndex === startIndex + i}
        />
      ))}
    </div>

    {/* Shelf Floor */}
    <div
      className="h-[16px] w-full relative z-20"
      style={{ background: "linear-gradient(to bottom, #c2996b 0%, #d9b88c 100%)" }}
    >
      <div className="absolute top-0 left-0 right-0 h-full bg-black/20 blur-[2px] transform scale-y-75 origin-top"></div>
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-black/10"></div>
    </div>

    {/* Shelf Front */}
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

// macOS-style Toolbar
const Toolbar = ({
  onRecommendClick,
  bookCount
}: {
  onRecommendClick: () => void;
  bookCount: number;
}) => (
  <div
    className="h-[38px] w-full flex items-center justify-between px-3 border-b border-gray-300/50"
    style={{
      background: "linear-gradient(to bottom, #f6f6f6 0%, #e8e8e8 100%)"
    }}
  >
    {/* Left section - View controls */}
    <div className="flex items-center gap-1">
      <div className="flex bg-white/60 rounded-md border border-gray-300/80 overflow-hidden">
        <button className="px-2.5 py-1 hover:bg-gray-200/50 border-r border-gray-300/80">
          <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
          </svg>
        </button>
        <button className="px-2.5 py-1 bg-gray-200/80">
          <svg className="w-4 h-4 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
            <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        </button>
      </div>
      <span className="text-xs text-gray-500 ml-2">{bookCount} books</span>
    </div>

    {/* Center - Sort options */}
    <div className="flex items-center gap-2">
      <select className="text-xs bg-white/60 border border-gray-300/80 rounded-md px-2 py-1 text-gray-600 focus:outline-none">
        <option>Sort by Title</option>
        <option>Sort by Author</option>
        <option>Sort by Recent</option>
      </select>
    </div>

    {/* Right section - Actions */}
    <div className="flex items-center gap-2">
      <button
        onClick={onRecommendClick}
        className="flex items-center gap-1.5 px-3 py-1 bg-white/60 hover:bg-white/80 border border-gray-300/80 rounded-md text-xs text-gray-700 font-medium transition-colors"
      >
        <svg
          className="w-3.5 h-3.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
        Recommend
      </button>
    </div>
  </div>
);

// macOS-style Modal (Sheet)
const RecommendModal = ({
  isOpen,
  onClose
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [bookTitle, setBookTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [note, setNote] = useState("");

  if (!isOpen) return null;

  const getMessage = () => {
    let msg = `Title: ${bookTitle}`;
    if (author) msg += `\nAuthor: ${author}`;
    if (note) msg += `\n\nNote: ${note}`;
    return msg;
  };

  const handleSend = () => {
    if (!bookTitle.trim()) return;
    const subject = encodeURIComponent("Book Recommendation");
    const body = encodeURIComponent(getMessage());
    window.open(
      `mailto:jacquelyn.halpern@gmail.com?subject=${subject}&body=${body}`,
      "_blank"
    );
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setBookTitle("");
    setAuthor("");
    setNote("");
  };

  const handleClose = () => {
    onClose();
    resetForm();
  };

  return (
    <div
      className="absolute inset-0 bg-black/30 flex items-start justify-center pt-12 z-50"
      onClick={handleClose}
    >
      {/* macOS Sheet-style modal */}
      <div
        className="w-[340px] rounded-lg shadow-2xl overflow-hidden"
        style={{
          background: "linear-gradient(to bottom, #f6f6f6 0%, #ececec 100%)",
          boxShadow: "0 10px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(0,0,0,0.1)"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 pt-5 pb-3">
          <h2 className="text-sm font-semibold text-gray-900">Recommend a Book</h2>
          <p className="text-xs text-gray-500">Share your favorites with me!</p>
        </div>

        {/* Form */}
        <div className="px-5 pb-4 space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Book Title
            </label>
            <input
              type="text"
              placeholder="Enter book title..."
              value={bookTitle}
              onChange={(e) => setBookTitle(e.target.value)}
              className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-inner"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Author (optional)
            </label>
            <input
              type="text"
              placeholder="Author name..."
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-inner"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Why should I read this?
            </label>
            <textarea
              placeholder="Optional note..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none shadow-inner"
            />
          </div>
        </div>

        {/* Footer with buttons - right justified */}
        <div
          className="px-5 py-3 flex justify-end gap-2 border-t border-gray-300/50"
          style={{ background: "linear-gradient(to bottom, #e8e8e8 0%, #d8d8d8 100%)" }}
        >
          <button
            onClick={handleClose}
            className="px-4 py-1.5 bg-white hover:bg-gray-50 border border-gray-300 rounded-md text-sm text-gray-700 font-medium shadow-sm transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={!bookTitle.trim()}
            className="px-5 py-1.5 rounded-md text-sm text-white font-medium shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: bookTitle.trim()
                ? "linear-gradient(to bottom, #4BA3F5 0%, #1A6ED8 100%)"
                : "#a0a0a0",
              boxShadow: bookTitle.trim()
                ? "0 1px 2px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.3)"
                : "none"
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

const IBooks = ({ width = 800 }: { width?: number }) => {
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const [showRecommendModal, setShowRecommendModal] = useState(false);

  const availableWidth = width - 128;
  const itemsPerShelf = Math.max(1, Math.floor(availableWidth / 120));

  const handleDragStart = (index: number) => {
    setDragIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndex !== null && dragIndex !== index) {
      setOverIndex(index);
    }
  };

  const handleDragEnd = () => {
    if (dragIndex !== null && overIndex !== null && dragIndex !== overIndex) {
      const newBooks = [...books];
      const [draggedBook] = newBooks.splice(dragIndex, 1);
      newBooks.splice(overIndex, 0, draggedBook);
      setBooks(newBooks);
    }
    setDragIndex(null);
    setOverIndex(null);
  };

  const shelves: Book[][] = [];
  for (let i = 0; i < books.length; i += itemsPerShelf) {
    shelves.push(books.slice(i, i + itemsPerShelf));
  }
  while (shelves.length < 5) shelves.push([]);

  let bookIndex = 0;

  return (
    <div className="h-full w-full bg-[#3e2723] flex flex-col font-sans relative">
      {/* macOS-style Toolbar */}
      <Toolbar
        onRecommendClick={() => setShowRecommendModal(true)}
        bookCount={books.length}
      />

      {/* Bookshelf */}
      <div className="flex-1 bg-[#4a3215] relative overflow-y-auto overflow-x-hidden">
        {shelves.map((shelfBooks, index) => {
          const startIndex = bookIndex;
          bookIndex += shelfBooks.length;
          return (
            <ShelfRow
              key={index}
              books={shelfBooks}
              startIndex={startIndex}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
              dragIndex={dragIndex}
              overIndex={overIndex}
            />
          );
        })}
        <ShelfRow
          books={[]}
          startIndex={books.length}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          dragIndex={dragIndex}
          overIndex={overIndex}
        />
      </div>

      {/* Recommendation Modal */}
      <RecommendModal
        isOpen={showRecommendModal}
        onClose={() => setShowRecommendModal(false)}
      />
    </div>
  );
};

export default IBooks;
