import React, { useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Switch, 
  ActivityIndicator, 
  Modal 
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useBooks } from '../context/BookContext';
import Header from '../components/Header';
import { theme } from '../styles/theme';

const GENRES = ['Fiction', 'Non-Fiction', 'Academic', 'Other'];
const STATUSES = ['To Read', 'Reading', 'Finished'];

export default function ListScreen({ onNavigate, onSelectBook }) {
  const { user, logout } = useAuth();
  const { books, addBook, toggleFavorite } = useBooks();

  // Add Book Form state
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');
  const [status, setStatus] = useState('');
  const [rating, setRating] = useState('');
  const [notes, setNotes] = useState('');

  const [formErrors, setFormErrors] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [bookSuccess, setBookSuccess] = useState('');
  const [bookError, setBookError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modals for genre & status pickers
  const [showGenrePicker, setShowGenrePicker] = useState(false);
  const [showStatusPicker, setShowStatusPicker] = useState(false);

  // Filter & Search states
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [searchText, setSearchText] = useState('');

  // Validation function
  const validateForm = (t, a, g, s, r, n) => {
    const errs = {};

    // Title
    if (!t || t.trim() === '') {
      errs.title = 'Title is required';
    } else if (t.length > 100) {
      errs.title = 'Title must be at most 100 characters';
    }

    // Author
    if (!a || a.trim() === '') {
      errs.author = 'Author is required';
    } else if (a.length > 60) {
      errs.author = 'Author must be at most 60 characters';
    }

    // Genre: nothing chosen
    if (!g || g === '' || g === 'Choose genre') {
      errs.genre = 'Please choose a genre';
    }

    // Status: nothing chosen
    if (!s || s === '' || s === 'Choose status') {
      errs.status = 'Please choose a status';
    }

    // Rating: only if filled in: not a whole number from 0 to 5
    if (r !== undefined && r !== null && String(r).trim() !== '') {
      const trimmed = String(r).trim();
      const num = Number(trimmed);
      if (!/^\d+$/.test(trimmed) || isNaN(num) || num < 0 || num > 5) {
        errs.rating = 'Rating must be a whole number from 0 to 5';
      }
    }

    // Notes: longer than 300 characters
    if (n && n.length > 300) {
      errs.notes = 'Notes must be at most 300 characters';
    }

    return errs;
  };

  // Field change handlers that remove errors once valid
  const handleTitleChange = (val) => {
    setTitle(val);
    if (formSubmitted) {
      const errs = { ...formErrors };
      if (!val || val.trim() === '') {
        errs.title = 'Title is required';
      } else if (val.length > 100) {
        errs.title = 'Title must be at most 100 characters';
      } else {
        delete errs.title;
      }
      setFormErrors(errs);
    }
  };

  const handleAuthorChange = (val) => {
    setAuthor(val);
    if (formSubmitted) {
      const errs = { ...formErrors };
      if (!val || val.trim() === '') {
        errs.author = 'Author is required';
      } else if (val.length > 60) {
        errs.author = 'Author must be at most 60 characters';
      } else {
        delete errs.author;
      }
      setFormErrors(errs);
    }
  };

  const handleGenreSelect = (val) => {
    setGenre(val);
    setShowGenrePicker(false);
    if (formSubmitted) {
      const errs = { ...formErrors };
      if (!val || val === '' || val === 'Choose genre') {
        errs.genre = 'Please choose a genre';
      } else {
        delete errs.genre;
      }
      setFormErrors(errs);
    }
  };

  const handleStatusSelect = (val) => {
    setStatus(val);
    setShowStatusPicker(false);
    if (formSubmitted) {
      const errs = { ...formErrors };
      if (!val || val === '' || val === 'Choose status') {
        errs.status = 'Please choose a status';
      } else {
        delete errs.status;
      }
      setFormErrors(errs);
    }
  };

  const handleRatingChange = (val) => {
    setRating(val);
    if (formSubmitted) {
      const errs = { ...formErrors };
      if (val !== undefined && val !== null && String(val).trim() !== '') {
        const trimmed = String(val).trim();
        const num = Number(trimmed);
        if (!/^\d+$/.test(trimmed) || isNaN(num) || num < 0 || num > 5) {
          errs.rating = 'Rating must be a whole number from 0 to 5';
        } else {
          delete errs.rating;
        }
      } else {
        delete errs.rating;
      }
      setFormErrors(errs);
    }
  };

  const handleNotesChange = (val) => {
    setNotes(val);
    if (formSubmitted) {
      const errs = { ...formErrors };
      if (val && val.length > 300) {
        errs.notes = 'Notes must be at most 300 characters';
      } else {
        delete errs.notes;
      }
      setFormErrors(errs);
    }
  };

  // Submit Add Book
  const handleAddBook = async () => {
    setFormSubmitted(true);
    setBookSuccess('');
    setBookError('');

    const validation = validateForm(title, author, genre, status, rating, notes);
    setFormErrors(validation);

    if (Object.keys(validation).length > 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      await addBook({
        title,
        author,
        genre,
        status,
        rating,
        notes,
      });

      // Clear form on success
      setTitle('');
      setAuthor('');
      setGenre('');
      setStatus('');
      setRating('');
      setNotes('');
      setFormSubmitted(false);
      setFormErrors({});
      setBookSuccess('Book added');
    } catch (err) {
      setBookError(err.message || 'Error saving book to Firestore');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter & Search Logic
  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      // Genre filter
      if (selectedGenre !== 'All' && book.genre !== selectedGenre) {
        return false;
      }

      // Status filter
      if (selectedStatus !== 'All' && book.status !== selectedStatus) {
        return false;
      }

      // Favorites only switch
      if (favoritesOnly && !book.favorite) {
        return false;
      }

      // Search box: keeps only books whose title or author contains the typed text
      if (searchText.trim() !== '') {
        const query = searchText.trim().toLowerCase();
        const titleMatch = (book.title || '').toLowerCase().includes(query);
        const authorMatch = (book.author || '').toLowerCase().includes(query);
        if (!titleMatch && !authorMatch) {
          return false;
        }
      }

      return true;
    });
  }, [books, selectedGenre, selectedStatus, favoritesOnly, searchText]);

  // Reset all 4 filters
  const handleClearFilters = () => {
    setSelectedGenre('All');
    setSelectedStatus('All');
    setFavoritesOnly(false);
    setSearchText('');
  };

  // Summary breakdown of currently shown books
  const summary = useMemo(() => {
    const totalCount = filteredBooks.length;
    const favCount = filteredBooks.filter((b) => b.favorite).length;

    const counts = {
      'To Read': 0,
      'Reading': 0,
      'Finished': 0,
    };

    filteredBooks.forEach((b) => {
      if (counts[b.status] !== undefined) {
        counts[b.status] += 1;
      }
    });

    const statusPriority = { 'To Read': 1, 'Reading': 2, 'Finished': 3 };

    const statusList = Object.keys(counts)
      .filter((st) => counts[st] > 0)
      .map((st) => ({
        status: st,
        count: counts[st],
      }))
      .sort((a, b) => {
        if (b.count !== a.count) {
          return b.count - a.count;
        }
        return (statusPriority[a.status] || 99) - (statusPriority[b.status] || 99);
      });

    return {
      totalCount,
      favCount,
      statusList,
    };
  }, [filteredBooks]);

  return (
    <View testID="list-screen" style={styles.container}>
      <Header 
        user={user}
        onLogoutPress={logout}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        
        {/* ADD A BOOK SECTION */}
        <View testID="book-form" style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Add a book</Text>
            <View style={styles.sectionCloudBadge}>
              <Text style={styles.sectionCloudBadgeText}>☁️ NEW</Text>
            </View>
          </View>
          
          {bookSuccess ? (
            <View style={styles.successBox}>
              <Text testID="book-success" style={styles.successText}>
                {bookSuccess}
              </Text>
            </View>
          ) : null}

          {bookError ? (
            <View style={styles.errorBox}>
              <Text testID="error-book" style={styles.errorText}>
                {bookError}
              </Text>
            </View>
          ) : null}

          {/* Title */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabelHeader}>TITLE *</Text>
            <TextInput
              style={[styles.input, formErrors.title ? styles.inputError : null]}
              value={title}
              onChangeText={handleTitleChange}
              placeholder="e.g. Dune"
              placeholderTextColor="#94A3B8"
            />
            {formErrors.title ? (
              <Text style={styles.fieldError}>{formErrors.title}</Text>
            ) : null}
          </View>

          {/* Author */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabelHeader}>AUTHOR *</Text>
            <TextInput
              style={[styles.input, formErrors.author ? styles.inputError : null]}
              value={author}
              onChangeText={handleAuthorChange}
              placeholder="e.g. Frank Herbert"
              placeholderTextColor="#94A3B8"
            />
            {formErrors.author ? (
              <Text style={styles.fieldError}>{formErrors.author}</Text>
            ) : null}
          </View>

          {/* Genre picker */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabelHeader}>GENRE *</Text>
            <TouchableOpacity 
              style={[styles.pickerButton, formErrors.genre ? styles.inputError : null]}
              onPress={() => setShowGenrePicker(true)}
              activeOpacity={0.7}
            >
              <Text style={genre ? styles.pickerValueText : styles.pickerPlaceholderText}>
                {genre || 'Choose genre'}
              </Text>
              <Text style={styles.pickerArrow}>▾</Text>
            </TouchableOpacity>
            {formErrors.genre ? (
              <Text style={styles.fieldError}>{formErrors.genre}</Text>
            ) : null}
          </View>

          {/* Status picker */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabelHeader}>STATUS *</Text>
            <TouchableOpacity 
              style={[styles.pickerButton, formErrors.status ? styles.inputError : null]}
              onPress={() => setShowStatusPicker(true)}
              activeOpacity={0.7}
            >
              <Text style={status ? styles.pickerValueText : styles.pickerPlaceholderText}>
                {status || 'Choose status'}
              </Text>
              <Text style={styles.pickerArrow}>▾</Text>
            </TouchableOpacity>
            {formErrors.status ? (
              <Text style={styles.fieldError}>{formErrors.status}</Text>
            ) : null}
          </View>

          {/* Rating */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.inputLabelHeader}>RATING</Text>
              <Text style={styles.labelHintText}>0 to 5, optional</Text>
            </View>
            <TextInput
              style={[styles.input, formErrors.rating ? styles.inputError : null]}
              value={rating}
              onChangeText={handleRatingChange}
              placeholder="e.g. 5"
              placeholderTextColor="#94A3B8"
              keyboardType="number-pad"
            />
            {formErrors.rating ? (
              <Text style={styles.fieldError}>{formErrors.rating}</Text>
            ) : null}
          </View>

          {/* Notes */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.inputLabelHeader}>NOTES</Text>
              <Text style={styles.labelHintText}>Max 300 characters, optional</Text>
            </View>
            <TextInput
              style={[styles.input, styles.multilineInput, formErrors.notes ? styles.inputError : null]}
              value={notes}
              onChangeText={handleNotesChange}
              placeholder="Short personal review or notes"
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={3}
            />
            {formErrors.notes ? (
              <Text style={styles.fieldError}>{formErrors.notes}</Text>
            ) : null}
          </View>

          {/* Submit */}
          <TouchableOpacity 
            style={styles.addButton}
            onPress={handleAddBook}
            disabled={isSubmitting}
            activeOpacity={0.85}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.addButtonText}>Add Book  →</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* FILTER, SEARCH AND SUMMARY SECTION */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Filter & Search</Text>

          {/* Search box */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabelHeader}>SEARCH BOOKS</Text>
            <TextInput
              style={styles.input}
              value={searchText}
              onChangeText={setSearchText}
              placeholder="Search by title or author..."
              placeholderTextColor="#94A3B8"
            />
          </View>

          {/* Genre filter */}
          <View style={styles.filterRowGroup}>
            <Text style={styles.inputLabelHeader}>GENRE FILTER</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterPillsContainer}>
              {['All', ...GENRES].map((g) => {
                const isActive = selectedGenre === g;
                return (
                  <TouchableOpacity
                    key={g}
                    style={[styles.filterPill, isActive && styles.filterPillActive]}
                    onPress={() => setSelectedGenre(g)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.filterPillText, isActive && styles.filterPillTextActive]}>
                      {g}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Status filter */}
          <View style={styles.filterRowGroup}>
            <Text style={styles.inputLabelHeader}>STATUS FILTER</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterPillsContainer}>
              {['All', ...STATUSES].map((s) => {
                const isActive = selectedStatus === s;
                return (
                  <TouchableOpacity
                    key={s}
                    style={[styles.filterPill, isActive && styles.filterPillActive]}
                    onPress={() => setSelectedStatus(s)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.filterPillText, isActive && styles.filterPillTextActive]}>
                      {s}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Favorites only switch */}
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Favorites only</Text>
            <Switch
              value={favoritesOnly}
              onValueChange={setFavoritesOnly}
              trackColor={{ false: '#E2E8F0', true: '#0EA5E9' }}
              thumbColor={favoritesOnly ? '#FFFFFF' : '#F1F5F9'}
            />
          </View>

          {/* Clear button */}
          <TouchableOpacity 
            style={styles.clearButton} 
            onPress={handleClearFilters}
            activeOpacity={0.75}
          >
            <Text style={styles.clearButtonText}>Clear Filters ↺</Text>
          </TouchableOpacity>

          {/* Summary Box */}
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryHeading}>SUMMARY (CURRENTLY SHOWN)</Text>
            
            <View style={styles.summaryStatsRow}>
              <View style={styles.summaryStatCard}>
                <Text style={styles.summaryStatLabel}>Total Books</Text>
                <Text testID="book-count" style={styles.summaryStatValue}>
                  {summary.totalCount}
                </Text>
              </View>
              <View style={styles.summaryStatCard}>
                <Text style={styles.summaryStatLabel}>Favorites</Text>
                <Text testID="favorite-count" style={styles.summaryStatValueGold}>
                  {summary.favCount}
                </Text>
              </View>
            </View>

            {/* Status breakdown */}
            {summary.statusList.length > 0 ? (
              <View style={styles.breakdownList}>
                {summary.statusList.map((st) => (
                  <View key={st.status} style={styles.breakdownRow}>
                    <Text style={styles.breakdownStatusName}>{st.status}</Text>
                    <View style={styles.breakdownBadge}>
                      <Text style={styles.breakdownCount}>{st.count}</Text>
                    </View>
                  </View>
                ))}
              </View>
            ) : null}
          </View>
        </View>

        {/* THE BOOK LIST */}
        <View style={styles.listSection}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Books List</Text>
            <Text style={styles.bookListCountText}>
              {filteredBooks.length} {filteredBooks.length === 1 ? 'book' : 'books'}
            </Text>
          </View>
          
          {filteredBooks.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>☁️</Text>
              <Text testID="books-empty" style={styles.emptyText}>
                No books found
              </Text>
              <Text style={styles.emptySubtext}>
                Try adjusting your search terms or filters above.
              </Text>
            </View>
          ) : (
            filteredBooks.map((book) => (
              <TouchableOpacity
                key={book.id}
                testID="book-item"
                style={styles.bookItem}
                onPress={() => onSelectBook(book.id)}
                activeOpacity={0.8}
              >
                <View style={styles.bookInfo}>
                  <Text style={styles.bookTitle}>{book.title}</Text>
                  <Text style={styles.bookAuthor}>by {book.author}</Text>
                  
                  <View style={styles.bookTagsRow}>
                    <View style={styles.genreTag}>
                      <Text style={styles.genreTagText}>{book.genre}</Text>
                    </View>
                    
                    <View style={[
                      styles.statusTag,
                      book.status === 'To Read' && styles.statusToRead,
                      book.status === 'Reading' && styles.statusReading,
                      book.status === 'Finished' && styles.statusFinished,
                    ]}>
                      <Text style={[
                        styles.statusTagText,
                        book.status === 'To Read' && styles.statusToReadText,
                        book.status === 'Reading' && styles.statusReadingText,
                        book.status === 'Finished' && styles.statusFinishedText,
                      ]}>{book.status}</Text>
                    </View>

                    {book.rating !== null && book.rating !== undefined ? (
                      <View style={styles.ratingTag}>
                        <Text style={styles.ratingTagText}>★ {book.rating}/5</Text>
                      </View>
                    ) : null}
                  </View>
                </View>

                {/* Favorite Star Toggle */}
                <TouchableOpacity
                  style={styles.starButton}
                  onPress={() => toggleFavorite(book.id)}
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.starIcon, book.favorite ? styles.starOn : styles.starOff]}>
                    {book.favorite ? '★' : '☆'}
                  </Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      {/* Genre Picker Modal */}
      <Modal visible={showGenrePicker} transparent animationType="fade">
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setShowGenrePicker(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose Genre</Text>
            <TouchableOpacity 
              style={styles.modalOption} 
              onPress={() => handleGenreSelect('Choose genre')}
            >
              <Text style={styles.modalOptionMuted}>Choose genre (empty)</Text>
            </TouchableOpacity>
            {GENRES.map((g) => (
              <TouchableOpacity 
                key={g} 
                style={styles.modalOption} 
                onPress={() => handleGenreSelect(g)}
              >
                <Text style={styles.modalOptionText}>{g}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Status Picker Modal */}
      <Modal visible={showStatusPicker} transparent animationType="fade">
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setShowStatusPicker(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose Status</Text>
            <TouchableOpacity 
              style={styles.modalOption} 
              onPress={() => handleStatusSelect('Choose status')}
            >
              <Text style={styles.modalOptionMuted}>Choose status (empty)</Text>
            </TouchableOpacity>
            {STATUSES.map((s) => (
              <TouchableOpacity 
                key={s} 
                style={styles.modalOption} 
                onPress={() => handleStatusSelect(s)}
              >
                <Text style={styles.modalOptionText}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    marginBottom: 16,
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 2,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.4,
  },
  sectionCloudBadge: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 9999,
  },
  sectionCloudBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0284C7',
    letterSpacing: 0.5,
  },
  successBox: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
    borderWidth: 1,
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  successText: {
    color: '#059669',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  errorBox: {
    backgroundColor: '#FFF1F2',
    borderColor: '#FECDD3',
    borderWidth: 1,
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#E11D48',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 16,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  inputLabelHeader: {
    fontSize: 12,
    fontWeight: '800',
    color: '#475569',
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  labelHintText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 15,
    color: '#0F172A',
    backgroundColor: '#FFFFFF',
  },
  multilineInput: {
    minHeight: 70,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#E11D48',
    backgroundColor: '#FFF1F2',
  },
  fieldError: {
    color: '#E11D48',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600',
  },
  pickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 13,
    backgroundColor: '#FFFFFF',
  },
  pickerPlaceholderText: {
    color: '#94A3B8',
    fontSize: 15,
  },
  pickerValueText: {
    color: '#0F172A',
    fontSize: 15,
    fontWeight: '600',
  },
  pickerArrow: {
    fontSize: 14,
    color: '#64748B',
  },
  addButton: {
    backgroundColor: '#0EA5E9',
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  filterRowGroup: {
    marginBottom: 16,
  },
  filterPillsContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 2,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 9999,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  filterPillActive: {
    backgroundColor: '#0EA5E9',
    borderColor: '#0EA5E9',
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 2,
  },
  filterPillText: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '700',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    marginTop: 4,
  },
  switchLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  clearButton: {
    backgroundColor: '#F0F9FF',
    borderWidth: 1.5,
    borderColor: '#BAE6FD',
    borderRadius: 12,
    paddingVertical: 11,
    alignItems: 'center',
    marginTop: 8,
  },
  clearButtonText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0284C7',
  },
  summaryContainer: {
    marginTop: 18,
    paddingTop: 16,
    borderTopWidth: 1.5,
    borderTopColor: '#F1F5F9',
  },
  summaryHeading: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
    marginBottom: 12,
    letterSpacing: 0.8,
  },
  summaryStatsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  summaryStatCard: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  summaryStatLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '700',
    marginBottom: 2,
  },
  summaryStatValue: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0EA5E9',
  },
  summaryStatValueGold: {
    fontSize: 22,
    fontWeight: '900',
    color: '#F59E0B',
  },
  breakdownList: {
    marginTop: 4,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 6,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 3,
  },
  breakdownStatusName: {
    fontSize: 13,
    color: '#334155',
    fontWeight: '600',
  },
  breakdownBadge: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 9999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  breakdownCount: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0284C7',
  },
  listSection: {
    marginTop: 4,
  },
  bookListCountText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  emptyContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 17,
    color: '#0F172A',
    fontWeight: '800',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
  },
  bookItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    marginBottom: 12,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  bookInfo: {
    flex: 1,
    marginRight: 12,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 3,
  },
  bookAuthor: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 10,
    fontWeight: '500',
  },
  bookTagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  genreTag: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  genreTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
  },
  statusTag: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  statusTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  statusToRead: {
    backgroundColor: '#E0F2FE',
    borderColor: '#BAE6FD',
    borderWidth: 1,
  },
  statusToReadText: {
    color: '#0284C7',
    fontWeight: '800',
  },
  statusReading: {
    backgroundColor: '#EEF2FF',
    borderColor: '#C7D2FE',
    borderWidth: 1,
  },
  statusReadingText: {
    color: '#6366F1',
    fontWeight: '800',
  },
  statusFinished: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
    borderWidth: 1,
  },
  statusFinishedText: {
    color: '#059669',
    fontWeight: '800',
  },
  ratingTag: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  ratingTagText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#B45309',
  },
  starButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  starIcon: {
    fontSize: 26,
  },
  starOn: {
    color: '#F59E0B',
  },
  starOff: {
    color: '#CBD5E1',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: '100%',
    maxWidth: 320,
    padding: 20,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 6,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
  },
  modalOption: {
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalOptionMuted: {
    fontSize: 14,
    color: '#94A3B8',
    fontStyle: 'italic',
  },
  modalOptionText: {
    fontSize: 15,
    color: '#0F172A',
    fontWeight: '600',
  },
});
