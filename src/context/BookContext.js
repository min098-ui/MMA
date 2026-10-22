import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  getDocs 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './AuthContext';

const BookContext = createContext({});

export const BookProvider = ({ children }) => {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setBooks([]);
      return;
    }

    setLoading(true);
    // Listen for real-time updates for the logged in user's books
    const q = query(
      collection(db, 'books'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list = [];
        snapshot.forEach((docSnap) => {
          list.push({
            id: docSnap.id,
            ...docSnap.data(),
          });
        });

        // Sort alphabetically by title (not case-sensitive; equal titles ordered by author)
        list.sort((a, b) => {
          const titleA = (a.title || '').trim().toLowerCase();
          const titleB = (b.title || '').trim().toLowerCase();
          const comp = titleA.localeCompare(titleB);
          if (comp !== 0) return comp;

          const authorA = (a.author || '').trim().toLowerCase();
          const authorB = (b.author || '').trim().toLowerCase();
          return authorA.localeCompare(authorB);
        });

        setBooks(list);
        setLoading(false);
      },
      (error) => {
        console.error('Error listening to books:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Add a book
  const addBook = async (data) => {
    if (!user) throw new Error('User not logged in');

    const cleanTitle = (data.title || '').trim();
    const cleanAuthor = (data.author || '').trim();
    const normalizedTitle = cleanTitle.toLowerCase();
    const normalizedAuthor = cleanAuthor.toLowerCase();

    // Check duplicate in current user's state
    const duplicateInState = books.some(
      (b) =>
        (b.title || '').trim().toLowerCase() === normalizedTitle &&
        (b.author || '').trim().toLowerCase() === normalizedAuthor
    );

    if (duplicateInState) {
      throw new Error('The same title + author was already saved');
    }

    // Double check with Firestore query
    const q = query(
      collection(db, 'books'),
      where('userId', '==', user.uid)
    );
    const existingSnap = await getDocs(q);
    const duplicateInDb = existingSnap.docs.some((d) => {
      const bookData = d.data();
      return (
        (bookData.title || '').trim().toLowerCase() === normalizedTitle &&
        (bookData.author || '').trim().toLowerCase() === normalizedAuthor
      );
    });

    if (duplicateInDb) {
      throw new Error('The same title + author was already saved');
    }

    const newBook = {
      userId: user.uid,
      title: cleanTitle,
      author: cleanAuthor,
      genre: data.genre,
      status: data.status,
      rating:
        data.rating !== undefined && data.rating !== null && data.rating !== ''
          ? parseInt(data.rating, 10)
          : null,
      favorite: false,
      notes: data.notes ? data.notes.trim() : '',
      createdAt: new Date().toISOString(),
    };

    const docRef = await addDoc(collection(db, 'books'), newBook);
    return docRef.id;
  };

  // Update a book
  const updateBook = async (id, data) => {
    if (!user) throw new Error('User not logged in');

    const cleanTitle = (data.title || '').trim();
    const cleanAuthor = (data.author || '').trim();
    const normalizedTitle = cleanTitle.toLowerCase();
    const normalizedAuthor = cleanAuthor.toLowerCase();

    // Check duplicate with another book owned by user
    const duplicate = books.some(
      (b) =>
        b.id !== id &&
        (b.title || '').trim().toLowerCase() === normalizedTitle &&
        (b.author || '').trim().toLowerCase() === normalizedAuthor
    );

    if (duplicate) {
      throw new Error('The same title + author was already saved');
    }

    const updatedData = {
      title: cleanTitle,
      author: cleanAuthor,
      genre: data.genre,
      status: data.status,
      rating:
        data.rating !== undefined && data.rating !== null && data.rating !== ''
          ? parseInt(data.rating, 10)
          : null,
      notes: data.notes ? data.notes.trim() : '',
    };

    if (data.favorite !== undefined) {
      updatedData.favorite = data.favorite;
    }

    await updateDoc(doc(db, 'books', id), updatedData);
  };

  // Toggle favorite flag
  const toggleFavorite = async (id) => {
    if (!user) return;
    const book = books.find((b) => b.id === id);
    if (!book) return;

    await updateDoc(doc(db, 'books', id), {
      favorite: !book.favorite,
    });
  };

  // Delete a book
  const deleteBook = async (id) => {
    if (!user) return;
    await deleteDoc(doc(db, 'books', id));
  };

  return (
    <BookContext.Provider
      value={{
        books,
        loading,
        addBook,
        updateBook,
        toggleFavorite,
        deleteBook,
      }}
    >
      {children}
    </BookContext.Provider>
  );
};

export const useBooks = () => useContext(BookContext);
