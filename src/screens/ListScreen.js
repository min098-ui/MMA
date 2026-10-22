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
      // Show exact message in error-book
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

      // Search box: keeps only books whose title or author contains the typed text (not case-sensitive, spaces at both ends ignored)
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

    // Breakdown with one row per status that appears, status with most books first (equal counts: To Read, Reading, Finished)
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
          return b.count - a.count; // most books first
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
          <Text style={styles.sectionTitle}>Add a book</Text>
          
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
            <Text style={styles.label}>Title *</Text>
            <TextInput
              style={[styles.input, formErrors.title ? styles.inputError : null]}
              value={title}
              onChangeText={handleTitleChange}
              placeholder="e.g. Dune"
              placeholderTextColor={theme.colors.textMuted}
            />
            {formErrors.title ? (
              <Text style={styles.fieldError}>{formErrors.title}</Text>
            ) : null}
          </View>

          {/* Author */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Author *</Text>
            <TextInput
              style={[styles.input, formErrors.author ? styles.inputError : null]}
              value={author}
              onChangeText={handleAuthorChange}
              placeholder="e.g. Frank Herbert"
              placeholderTextColor={theme.colors.textMuted}
            />
            {formErrors.author ? (
              <Text style={styles.fieldError}>{formErrors.author}</Text>
            ) : null}
          </View>

          {/* Genre picker */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Genre *</Text>
            <TouchableOpacity 
              style={[styles.pickerButton, formErrors.genre ? styles.inputError : null]}
              onPress={() => setShowGenrePicker(true)}
              activeOpacity={0.7}
            >
              <Text style={genre ? styles.pickerValueText : styles.pickerPlaceholderText}>
                {genre || 'Choose genre'}
              </Text>
              <Text style={styles.pickerArrow}>▼</Text>
            </TouchableOpacity>
            {formErrors.genre ? (
              <Text style={styles.fieldError}>{formErrors.genre}</Text>
            ) : null}
          </View>

          {/* Status picker */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Status *</Text>
            <TouchableOpacity 
              style={[styles.pickerButton, formErrors.status ? styles.inputError : null]}
              onPress={() => setShowStatusPicker(true)}
              activeOpacity={0.7}
            >
              <Text style={status ? styles.pickerValueText : styles.pickerPlaceholderText}>
                {status || 'Choose status'}
              </Text>
              <Text style={styles.pickerArrow}>▼</Text>
            </TouchableOpacity>
            {formErrors.status ? (
              <Text style={styles.fieldError}>{formErrors.status}</Text>
            ) : null}
          </View>

          {/* Rating */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Rating (0 to 5, optional)</Text>
            <TextInput
              style={[styles.input, formErrors.rating ? styles.inputError : null]}
              value={rating}
              onChangeText={handleRatingChange}
              placeholder="e.g. 5"
              placeholderTextColor={theme.colors.textMuted}
              keyboardType="number-pad"
            />
            {formErrors.rating ? (
              <Text style={styles.fieldError}>{formErrors.rating}</Text>
            ) : null}
          </View>

          {/* Notes */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Notes (max 300 characters, optional)</Text>
            <TextInput
              style={[styles.input, styles.multilineInput, formErrors.notes ? styles.inputError : null]}
              value={notes}
              onChangeText={handleNotesChange}
              placeholder="Short personal review or notes"
              placeholderTextColor={theme.colors.textMuted}
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
            activeOpacity={0.8}
          >
            {isSubmitting ? (
              <ActivityIndicator color={theme.colors.white} />
            ) : (
              <Text style={styles.addButtonText}>Add Book</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* FILTER, SEARCH AND SUMMARY SECTION */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Filter & Search</Text>

          {/* Search box */}
          <View style={styles.searchContainer}>
            <Text style={styles.label}>Search</Text>
            <TextInput
              style={styles.searchInput}
              value={searchText}
              onChangeText={setSearchText}
              placeholder="Search title or author..."
              placeholderTextColor={theme.colors.textMuted}
            />
          </View>

          {/* Genre filter */}
          <View style={styles.filterRowGroup}>
            <Text style={styles.filterSectionLabel}>Genre filter:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterPillsContainer}>
              {['All', ...GENRES].map((g) => (
                <TouchableOpacity
                  key={g}
                  style={[styles.filterPill, selectedGenre === g && styles.filterPillActive]}
                  onPress={() => setSelectedGenre(g)}
                >
                  <Text style={[styles.filterPillText, selectedGenre === g && styles.filterPillTextActive]}>
                    {g}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Status filter */}
          <View style={styles.filterRowGroup}>
            <Text style={styles.filterSectionLabel}>Status filter:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterPillsContainer}>
              {['All', ...STATUSES].map((s) => (
                <TouchableOpacity
                  key={s}
                  style={[styles.filterPill, selectedStatus === s && styles.filterPillActive]}
                  onPress={() => setSelectedStatus(s)}
                >
                  <Text style={[styles.filterPillText, selectedStatus === s && styles.filterPillTextActive]}>
                    {s}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Favorites only switch */}
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Favorites only</Text>
            <Switch
              value={favoritesOnly}
              onValueChange={setFavoritesOnly}
              trackColor={{ false: '#CBD5E1', true: theme.colors.primaryLight }}
              thumbColor={favoritesOnly ? theme.colors.primary : '#F1F5F9'}
            />
          </View>

          {/* Clear button */}
          <TouchableOpacity 
            style={styles.clearButton} 
            onPress={handleClearFilters}
            activeOpacity={0.7}
          >
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>

          {/* Summary */}
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryHeading}>Summary (Currently Shown)</Text>
            <View style={styles.summaryStatsRow}>
              <View style={styles.summaryStatItem}>
                <Text style={styles.summaryStatLabel}>Books:</Text>
                <Text testID="book-count" style={styles.summaryStatValue}>
                  {summary.totalCount}
                </Text>
              </View>
              <View style={styles.summaryStatItem}>
                <Text style={styles.summaryStatLabel}>Favorites:</Text>
                <Text testID="favorite-count" style={styles.summaryStatValue}>
                  {summary.favCount}
                </Text>
              </View>
            </View>

            {/* Status breakdown */}
            {summary.statusList.length > 0 ? (
              <View style={styles.breakdownList}>
                {summary.statusList.map((st) => (
                  <View key={st.status} style={styles.breakdownRow}>
                    <Text style={styles.breakdownStatusName}>{st.status}:</Text>
                    <Text style={styles.breakdownCount}>{st.count}</Text>
                  </View>
                ))}
              </View>
            ) : null}
          </View>
        </View>

        {/* THE LIST */}
        <View style={styles.listSection}>
          <Text style={styles.sectionTitle}>Books List</Text>
          
          {filteredBooks.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text testID="books-empty" style={styles.emptyText}>
                No books found
              </Text>
            </View>
          ) : (
            filteredBooks.map((book) => (
              <TouchableOpacity
                key={book.id}
                testID="book-item"
                style={styles.bookItem}
                onPress={() => onSelectBook(book.id)}
                activeOpacity={0.7}
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
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
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
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    padding: theme.spacing.md,
    paddingBottom: 40,
  },
  sectionCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  successBox: {
    backgroundColor: theme.colors.successBg,
    borderColor: theme.colors.successBorder,
    borderWidth: 1,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    marginBottom: theme.spacing.md,
  },
  successText: {
    color: theme.colors.success,
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  errorBox: {
    backgroundColor: theme.colors.errorBg,
    borderColor: theme.colors.errorBorder,
    borderWidth: 1,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    marginBottom: theme.spacing.md,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 10,
    fontSize: 14,
    color: theme.colors.text,
    backgroundColor: '#FAFAFA',
  },
  multilineInput: {
    minHeight: 65,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: theme.colors.error,
    backgroundColor: theme.colors.errorBg,
  },
  fieldError: {
    color: theme.colors.error,
    fontSize: 12,
    marginTop: 4,
  },
  pickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 12,
    backgroundColor: '#FAFAFA',
  },
  pickerPlaceholderText: {
    color: theme.colors.textMuted,
    fontSize: 14,
  },
  pickerValueText: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '500',
  },
  pickerArrow: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  addButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.sm,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  addButtonText: {
    color: theme.colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
  searchContainer: {
    marginBottom: theme.spacing.md,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 10,
    fontSize: 14,
    color: theme.colors.text,
    backgroundColor: '#FAFAFA',
  },
  filterRowGroup: {
    marginBottom: theme.spacing.md,
  },
  filterSectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginBottom: 6,
  },
  filterPillsContainer: {
    flexDirection: 'row',
    gap: 6,
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: '#FAFAFA',
  },
  filterPillActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterPillText: {
    fontSize: 12,
    color: theme.colors.text,
    fontWeight: '500',
  },
  filterPillTextActive: {
    color: theme.colors.white,
    fontWeight: '700',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    marginTop: theme.spacing.xs,
  },
  switchLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
  },
  clearButton: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    paddingVertical: 8,
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  clearButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  summaryContainer: {
    marginTop: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  summaryHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  summaryStatsRow: {
    flexDirection: 'row',
    gap: theme.spacing.xl,
    marginBottom: theme.spacing.sm,
  },
  summaryStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  summaryStatLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  summaryStatValue: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  breakdownList: {
    marginTop: theme.spacing.xs,
    backgroundColor: '#F8FAFC',
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.sm,
    gap: 4,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  breakdownStatusName: {
    fontSize: 13,
    color: theme.colors.text,
    fontWeight: '500',
  },
  breakdownCount: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.text,
  },
  listSection: {
    marginTop: theme.spacing.sm,
  },
  emptyContainer: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  emptyText: {
    fontSize: 15,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  bookItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.md,
  },
  bookInfo: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 2,
  },
  bookAuthor: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginBottom: 8,
  },
  bookTagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  genreTag: {
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  genreTagText: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  statusTag: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusTagText: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  statusToRead: {
    backgroundColor: '#E0F2FE',
    borderColor: '#BAE6FD',
    borderWidth: 1,
  },
  statusToReadText: {
    color: '#0284C7',
    fontWeight: '700',
  },
  statusReading: {
    backgroundColor: '#DBEAFE',
    borderColor: '#BFDBFE',
    borderWidth: 1,
  },
  statusReadingText: {
    color: '#1D4ED8',
    fontWeight: '700',
  },
  statusFinished: {
    backgroundColor: '#CCFBF1',
    borderColor: '#99F6E4',
    borderWidth: 1,
  },
  statusFinishedText: {
    color: '#0F766E',
    fontWeight: '700',
  },
  ratingTag: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  ratingTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#D97706',
  },
  starButton: {
    padding: 6,
  },
  starIcon: {
    fontSize: 26,
  },
  starOn: {
    color: theme.colors.star,
  },
  starOff: {
    color: '#CBD5E1',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  modalContent: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    width: '100%',
    maxWidth: 320,
    padding: theme.spacing.lg,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  modalOption: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  modalOptionMuted: {
    fontSize: 14,
    color: theme.colors.textMuted,
    fontStyle: 'italic',
  },
  modalOptionText: {
    fontSize: 15,
    color: theme.colors.text,
    fontWeight: '500',
  },
});
