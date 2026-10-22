import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Alert,
  Modal,
  ActivityIndicator
} from 'react-native';
import { useBooks } from '../context/BookContext';
import { theme } from '../styles/theme';

const GENRES = ['Fiction', 'Non-Fiction', 'Academic', 'Other'];
const STATUSES = ['To Read', 'Reading', 'Finished'];

export default function DetailScreen({ bookId, onBack }) {
  const { books, updateBook, toggleFavorite, deleteBook } = useBooks();
  const book = books.find((b) => b.id === bookId);

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Edit form state
  const [editTitle, setEditTitle] = useState('');
  const [editAuthor, setEditAuthor] = useState('');
  const [editGenre, setEditGenre] = useState('');
  const [editStatus, setEditStatus] = useState('');
  const [editRating, setEditRating] = useState('');
  const [editNotes, setEditNotes] = useState('');

  const [errors, setErrors] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [editError, setEditError] = useState('');

  // Modals for pickers
  const [showGenrePicker, setShowGenrePicker] = useState(false);
  const [showStatusPicker, setShowStatusPicker] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Sync edit form with book data
  useEffect(() => {
    if (book) {
      setEditTitle(book.title || '');
      setEditAuthor(book.author || '');
      setEditGenre(book.genre || '');
      setEditStatus(book.status || '');
      setEditRating(book.rating !== null && book.rating !== undefined ? String(book.rating) : '');
      setEditNotes(book.notes || '');
    }
  }, [book]);

  if (!book) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back to List</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundText}>Book not found.</Text>
        </View>
      </View>
    );
  }

  // Validation function matching Add Book exactly
  const validateForm = (t, a, g, s, r, n) => {
    const errs = {};

    if (!t || t.trim() === '') {
      errs.title = 'Title is required';
    } else if (t.length > 100) {
      errs.title = 'Title must be at most 100 characters';
    }

    if (!a || a.trim() === '') {
      errs.author = 'Author is required';
    } else if (a.length > 60) {
      errs.author = 'Author must be at most 60 characters';
    }

    if (!g || g === '' || g === 'Choose genre') {
      errs.genre = 'Please choose a genre';
    }

    if (!s || s === '' || s === 'Choose status') {
      errs.status = 'Please choose a status';
    }

    if (r !== undefined && r !== null && String(r).trim() !== '') {
      const trimmed = String(r).trim();
      const num = Number(trimmed);
      if (!/^\d+$/.test(trimmed) || isNaN(num) || num < 0 || num > 5) {
        errs.rating = 'Rating must be a whole number from 0 to 5';
      }
    }

    if (n && n.length > 300) {
      errs.notes = 'Notes must be at most 300 characters';
    }

    return errs;
  };

  const handleTitleChange = (val) => {
    setEditTitle(val);
    if (hasSubmitted) {
      const errs = { ...errors };
      if (!val || val.trim() === '') {
        errs.title = 'Title is required';
      } else if (val.length > 100) {
        errs.title = 'Title must be at most 100 characters';
      } else {
        delete errs.title;
      }
      setErrors(errs);
    }
  };

  const handleAuthorChange = (val) => {
    setEditAuthor(val);
    if (hasSubmitted) {
      const errs = { ...errors };
      if (!val || val.trim() === '') {
        errs.author = 'Author is required';
      } else if (val.length > 60) {
        errs.author = 'Author must be at most 60 characters';
      } else {
        delete errs.author;
      }
      setErrors(errs);
    }
  };

  const handleGenreSelect = (val) => {
    setEditGenre(val);
    setShowGenrePicker(false);
    if (hasSubmitted) {
      const errs = { ...errors };
      if (!val || val === '' || val === 'Choose genre') {
        errs.genre = 'Please choose a genre';
      } else {
        delete errs.genre;
      }
      setErrors(errs);
    }
  };

  const handleStatusSelect = (val) => {
    setEditStatus(val);
    setShowStatusPicker(false);
    if (hasSubmitted) {
      const errs = { ...errors };
      if (!val || val === '' || val === 'Choose status') {
        errs.status = 'Please choose a status';
      } else {
        delete errs.status;
      }
      setErrors(errs);
    }
  };

  const handleRatingChange = (val) => {
    setEditRating(val);
    if (hasSubmitted) {
      const errs = { ...errors };
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
      setErrors(errs);
    }
  };

  const handleNotesChange = (val) => {
    setEditNotes(val);
    if (hasSubmitted) {
      const errs = { ...errors };
      if (val && val.length > 300) {
        errs.notes = 'Notes must be at most 300 characters';
      } else {
        delete errs.notes;
      }
      setErrors(errs);
    }
  };

  const handleStartEdit = () => {
    setIsEditing(true);
    setHasSubmitted(false);
    setErrors({});
    setEditError('');
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setHasSubmitted(false);
    setErrors({});
    setEditError('');
    if (book) {
      setEditTitle(book.title || '');
      setEditAuthor(book.author || '');
      setEditGenre(book.genre || '');
      setEditStatus(book.status || '');
      setEditRating(book.rating !== null && book.rating !== undefined ? String(book.rating) : '');
      setEditNotes(book.notes || '');
    }
  };

  const handleSaveEdit = async () => {
    setHasSubmitted(true);
    setEditError('');

    const validationErrors = validateForm(
      editTitle,
      editAuthor,
      editGenre,
      editStatus,
      editRating,
      editNotes
    );
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setLoading(true);
    try {
      await updateBook(book.id, {
        title: editTitle,
        author: editAuthor,
        genre: editGenre,
        status: editStatus,
        rating: editRating,
        notes: editNotes,
      });
      setIsEditing(false);
    } catch (err) {
      setEditError(err.message || 'Error updating book');
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    setShowDeleteModal(false);
    try {
      await deleteBook(book.id);
      onBack(); // Returns to list screen immediately
    } catch (err) {
      Alert.alert('Error', err.message || 'Could not delete book');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header bar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back to List</Text>
        </TouchableOpacity>
        
        {!isEditing && (
          <TouchableOpacity 
            style={styles.starHeaderButton}
            onPress={() => toggleFavorite(book.id)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={[styles.starIcon, book.favorite ? styles.starOn : styles.starOff]}>
              {book.favorite ? '★' : '☆'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          {isEditing ? (
            /* EDIT MODE */
            <View>
              <Text style={styles.cardTitle}>Edit Book</Text>

              {editError ? (
                <View style={styles.errorBox}>
                  <Text style={styles.errorText}>{editError}</Text>
                </View>
              ) : null}

              {/* Title */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Title *</Text>
                <TextInput
                  style={[styles.input, errors.title ? styles.inputError : null]}
                  value={editTitle}
                  onChangeText={handleTitleChange}
                  placeholder="e.g. Dune"
                />
                {errors.title ? (
                  <Text style={styles.fieldError}>{errors.title}</Text>
                ) : null}
              </View>

              {/* Author */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Author *</Text>
                <TextInput
                  style={[styles.input, errors.author ? styles.inputError : null]}
                  value={editAuthor}
                  onChangeText={handleAuthorChange}
                  placeholder="e.g. Frank Herbert"
                />
                {errors.author ? (
                  <Text style={styles.fieldError}>{errors.author}</Text>
                ) : null}
              </View>

              {/* Genre Picker */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Genre *</Text>
                <TouchableOpacity 
                  style={[styles.pickerButton, errors.genre ? styles.inputError : null]}
                  onPress={() => setShowGenrePicker(true)}
                >
                  <Text style={editGenre ? styles.pickerValueText : styles.pickerPlaceholderText}>
                    {editGenre || 'Choose genre'}
                  </Text>
                  <Text style={styles.pickerArrow}>▼</Text>
                </TouchableOpacity>
                {errors.genre ? (
                  <Text style={styles.fieldError}>{errors.genre}</Text>
                ) : null}
              </View>

              {/* Status Picker */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Status *</Text>
                <TouchableOpacity 
                  style={[styles.pickerButton, errors.status ? styles.inputError : null]}
                  onPress={() => setShowStatusPicker(true)}
                >
                  <Text style={editStatus ? styles.pickerValueText : styles.pickerPlaceholderText}>
                    {editStatus || 'Choose status'}
                  </Text>
                  <Text style={styles.pickerArrow}>▼</Text>
                </TouchableOpacity>
                {errors.status ? (
                  <Text style={styles.fieldError}>{errors.status}</Text>
                ) : null}
              </View>

              {/* Rating */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Rating (0 to 5, optional)</Text>
                <TextInput
                  style={[styles.input, errors.rating ? styles.inputError : null]}
                  value={editRating}
                  onChangeText={handleRatingChange}
                  placeholder="e.g. 5"
                  keyboardType="number-pad"
                />
                {errors.rating ? (
                  <Text style={styles.fieldError}>{errors.rating}</Text>
                ) : null}
              </View>

              {/* Notes */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Notes (max 300 characters, optional)</Text>
                <TextInput
                  style={[styles.input, styles.multilineInput, errors.notes ? styles.inputError : null]}
                  value={editNotes}
                  onChangeText={handleNotesChange}
                  placeholder="Short personal review or notes"
                  multiline
                  numberOfLines={4}
                />
                {errors.notes ? (
                  <Text style={styles.fieldError}>{errors.notes}</Text>
                ) : null}
              </View>

              {/* Save & Cancel buttons */}
              <View style={styles.editActionRow}>
                <TouchableOpacity 
                  style={styles.saveButton} 
                  onPress={handleSaveEdit}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color={theme.colors.white} />
                  ) : (
                    <Text style={styles.saveButtonText}>Save</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.cancelButton} 
                  onPress={handleCancelEdit}
                  disabled={loading}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            /* VIEW MODE */
            <View>
              <Text style={styles.viewTitle}>{book.title}</Text>
              <Text style={styles.viewAuthor}>by {book.author}</Text>

              <View style={styles.detailRowsContainer}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Genre:</Text>
                  <View style={styles.genreTag}>
                    <Text style={styles.genreTagText}>{book.genre}</Text>
                  </View>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Status:</Text>
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
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Rating:</Text>
                  <Text style={styles.detailValue}>
                    {book.rating !== null && book.rating !== undefined 
                      ? `★ ${book.rating} / 5` 
                      : 'Not rated'}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Favorite:</Text>
                  <Text style={styles.detailValue}>
                    {book.favorite ? 'Yes (★ Favorited)' : 'No'}
                  </Text>
                </View>

                <View style={styles.notesContainer}>
                  <Text style={styles.detailLabel}>Notes:</Text>
                  <Text style={styles.notesText}>
                    {book.notes && book.notes.trim() ? book.notes : 'No notes added.'}
                  </Text>
                </View>
              </View>

              {/* View actions: Edit & Delete */}
              <View style={styles.viewActionsRow}>
                <TouchableOpacity 
                  style={styles.editButton} 
                  onPress={handleStartEdit}
                  activeOpacity={0.8}
                >
                  <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.deleteButton} 
                  onPress={() => setShowDeleteModal(true)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Delete Confirmation Modal */}
      <Modal visible={showDeleteModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Delete Book</Text>
            <Text style={styles.confirmDeleteMessage}>
              Are you sure you want to delete "{book.title}"? This action cannot be undone.
            </Text>
            <View style={styles.modalActionRow}>
              <TouchableOpacity 
                style={styles.confirmDeleteButton} 
                onPress={confirmDelete}
              >
                <Text style={styles.confirmDeleteText}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalCancelButton} 
                onPress={() => setShowDeleteModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    paddingVertical: 6,
  },
  backButtonText: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  starHeaderButton: {
    padding: 6,
  },
  starIcon: {
    fontSize: 28,
  },
  starOn: {
    color: theme.colors.star,
  },
  starOff: {
    color: '#CBD5E1',
  },
  scrollContent: {
    padding: theme.spacing.lg,
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
  },
  viewTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: theme.colors.text,
    marginBottom: 4,
  },
  viewAuthor: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xl,
  },
  detailRowsContainer: {
    gap: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    marginBottom: theme.spacing.xl,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    width: 80,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.text,
  },
  genreTag: {
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
  },
  genreTagText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  statusTag: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusTagText: {
    fontSize: 12,
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
  notesContainer: {
    marginTop: theme.spacing.xs,
  },
  notesText: {
    fontSize: 14,
    color: theme.colors.text,
    lineHeight: 22,
    marginTop: 6,
    backgroundColor: '#F8FAFC',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  viewActionsRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  editButton: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    borderRadius: theme.borderRadius.sm,
    alignItems: 'center',
  },
  editButtonText: {
    color: theme.colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: theme.colors.errorBg,
    borderWidth: 1,
    borderColor: theme.colors.errorBorder,
    paddingVertical: 12,
    borderRadius: theme.borderRadius.sm,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: theme.colors.danger,
    fontSize: 15,
    fontWeight: '700',
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
    minHeight: 80,
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
  editActionRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  saveButton: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    borderRadius: theme.borderRadius.sm,
    alignItems: 'center',
  },
  saveButtonText: {
    color: theme.colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingVertical: 12,
    borderRadius: theme.borderRadius.sm,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: theme.colors.textSecondary,
    fontSize: 15,
    fontWeight: '600',
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
    padding: theme.spacing.xl,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  confirmDeleteMessage: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    marginBottom: theme.spacing.xl,
  },
  modalActionRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  confirmDeleteButton: {
    flex: 1,
    backgroundColor: theme.colors.danger,
    paddingVertical: 10,
    borderRadius: theme.borderRadius.sm,
    alignItems: 'center',
  },
  confirmDeleteText: {
    color: theme.colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    paddingVertical: 10,
    borderRadius: theme.borderRadius.sm,
    alignItems: 'center',
  },
  modalCancelText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
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
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFoundText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
});
