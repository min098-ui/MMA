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
      onBack();
    } catch (err) {
      Alert.alert('Error', err.message || 'Could not delete book');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header bar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton} activeOpacity={0.7}>
          <Text style={styles.backButtonText}>← Back to List</Text>
        </TouchableOpacity>
        
        {!isEditing && (
          <TouchableOpacity 
            style={styles.starHeaderButton}
            onPress={() => toggleFavorite(book.id)}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            activeOpacity={0.7}
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
              <View style={styles.editHeaderRow}>
                <Text style={styles.cardTitle}>Edit Book</Text>
                <View style={styles.cloudBadge}>
                  <Text style={styles.cloudBadgeText}>☁️ EDITING</Text>
                </View>
              </View>

              {editError ? (
                <View style={styles.errorBox}>
                  <Text style={styles.errorText}>{editError}</Text>
                </View>
              ) : null}

              {/* Title */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabelHeader}>TITLE *</Text>
                <TextInput
                  style={[styles.input, errors.title ? styles.inputError : null]}
                  value={editTitle}
                  onChangeText={handleTitleChange}
                  placeholder="e.g. Dune"
                  placeholderTextColor="#94A3B8"
                />
                {errors.title ? (
                  <Text style={styles.fieldError}>{errors.title}</Text>
                ) : null}
              </View>

              {/* Author */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabelHeader}>AUTHOR *</Text>
                <TextInput
                  style={[styles.input, errors.author ? styles.inputError : null]}
                  value={editAuthor}
                  onChangeText={handleAuthorChange}
                  placeholder="e.g. Frank Herbert"
                  placeholderTextColor="#94A3B8"
                />
                {errors.author ? (
                  <Text style={styles.fieldError}>{errors.author}</Text>
                ) : null}
              </View>

              {/* Genre Picker */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabelHeader}>GENRE *</Text>
                <TouchableOpacity 
                  style={[styles.pickerButton, errors.genre ? styles.inputError : null]}
                  onPress={() => setShowGenrePicker(true)}
                  activeOpacity={0.7}
                >
                  <Text style={editGenre ? styles.pickerValueText : styles.pickerPlaceholderText}>
                    {editGenre || 'Choose genre'}
                  </Text>
                  <Text style={styles.pickerArrow}>▾</Text>
                </TouchableOpacity>
                {errors.genre ? (
                  <Text style={styles.fieldError}>{errors.genre}</Text>
                ) : null}
              </View>

              {/* Status Picker */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabelHeader}>STATUS *</Text>
                <TouchableOpacity 
                  style={[styles.pickerButton, errors.status ? styles.inputError : null]}
                  onPress={() => setShowStatusPicker(true)}
                  activeOpacity={0.7}
                >
                  <Text style={editStatus ? styles.pickerValueText : styles.pickerPlaceholderText}>
                    {editStatus || 'Choose status'}
                  </Text>
                  <Text style={styles.pickerArrow}>▾</Text>
                </TouchableOpacity>
                {errors.status ? (
                  <Text style={styles.fieldError}>{errors.status}</Text>
                ) : null}
              </View>

              {/* Rating */}
              <View style={styles.inputGroup}>
                <View style={styles.labelRow}>
                  <Text style={styles.inputLabelHeader}>RATING</Text>
                  <Text style={styles.labelHintText}>0 to 5, optional</Text>
                </View>
                <TextInput
                  style={[styles.input, errors.rating ? styles.inputError : null]}
                  value={editRating}
                  onChangeText={handleRatingChange}
                  placeholder="e.g. 5"
                  placeholderTextColor="#94A3B8"
                  keyboardType="number-pad"
                />
                {errors.rating ? (
                  <Text style={styles.fieldError}>{errors.rating}</Text>
                ) : null}
              </View>

              {/* Notes */}
              <View style={styles.inputGroup}>
                <View style={styles.labelRow}>
                  <Text style={styles.inputLabelHeader}>NOTES</Text>
                  <Text style={styles.labelHintText}>Max 300 characters, optional</Text>
                </View>
                <TextInput
                  style={[styles.input, styles.multilineInput, errors.notes ? styles.inputError : null]}
                  value={editNotes}
                  onChangeText={handleNotesChange}
                  placeholder="Short personal review or notes"
                  placeholderTextColor="#94A3B8"
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
                  activeOpacity={0.85}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.saveButtonText}>Save Changes  →</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.cancelButton} 
                  onPress={handleCancelEdit}
                  disabled={loading}
                  activeOpacity={0.85}
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
                  <Text style={styles.detailLabel}>GENRE</Text>
                  <View style={styles.genreTag}>
                    <Text style={styles.genreTagText}>{book.genre}</Text>
                  </View>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>STATUS</Text>
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
                  <Text style={styles.detailLabel}>RATING</Text>
                  {book.rating !== null && book.rating !== undefined ? (
                    <View style={styles.ratingTag}>
                      <Text style={styles.ratingTagText}>★ {book.rating} / 5</Text>
                    </View>
                  ) : (
                    <Text style={styles.detailValueMuted}>Not rated</Text>
                  )}
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>FAVORITE</Text>
                  <View style={[styles.favPill, book.favorite && styles.favPillActive]}>
                    <Text style={[styles.favPillText, book.favorite && styles.favPillTextActive]}>
                      {book.favorite ? '★ Favorited' : '☆ Not favorited'}
                    </Text>
                  </View>
                </View>

                <View style={styles.notesContainer}>
                  <Text style={styles.detailLabel}>NOTES</Text>
                  <View style={styles.notesBox}>
                    <Text style={styles.notesText}>
                      {book.notes && book.notes.trim() ? book.notes : 'No notes added yet.'}
                    </Text>
                  </View>
                </View>
              </View>

              {/* View actions: Edit & Delete */}
              <View style={styles.viewActionsRow}>
                <TouchableOpacity 
                  style={styles.editButton} 
                  onPress={handleStartEdit}
                  activeOpacity={0.85}
                >
                  <Text style={styles.editButtonText}>Edit Book ✎</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.deleteButton} 
                  onPress={() => setShowDeleteModal(true)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.deleteButtonText}>Delete 🗑</Text>
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
                activeOpacity={0.85}
              >
                <Text style={styles.confirmDeleteText}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalCancelButton} 
                onPress={() => setShowDeleteModal(false)}
                activeOpacity={0.85}
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
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backButton: {
    paddingVertical: 6,
  },
  backButtonText: {
    fontSize: 14,
    color: '#0EA5E9',
    fontWeight: '800',
  },
  starHeaderButton: {
    padding: 6,
  },
  starIcon: {
    fontSize: 28,
  },
  starOn: {
    color: '#F59E0B',
  },
  starOff: {
    color: '#CBD5E1',
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 22,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
  },
  editHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.4,
  },
  cloudBadge: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 9999,
  },
  cloudBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0284C7',
    letterSpacing: 0.5,
  },
  viewTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 4,
    letterSpacing: -0.4,
  },
  viewAuthor: {
    fontSize: 15,
    color: '#64748B',
    marginBottom: 20,
    fontWeight: '500',
  },
  detailRowsContainer: {
    gap: 14,
    paddingBottom: 20,
    borderBottomWidth: 1.5,
    borderBottomColor: '#F1F5F9',
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    width: 80,
    letterSpacing: 0.6,
  },
  detailValueMuted: {
    fontSize: 14,
    color: '#94A3B8',
    fontStyle: 'italic',
  },
  genreTag: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  genreTagText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  statusTag: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  statusTagText: {
    fontSize: 12,
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
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  ratingTagText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#B45309',
  },
  favPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  favPillActive: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FDE68A',
  },
  favPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  favPillTextActive: {
    color: '#B45309',
    fontWeight: '800',
  },
  notesContainer: {
    marginTop: 4,
  },
  notesBox: {
    marginTop: 8,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  notesText: {
    fontSize: 14,
    color: '#1E293B',
    lineHeight: 22,
  },
  viewActionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  editButton: {
    flex: 2,
    backgroundColor: '#0EA5E9',
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 3,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#FFF1F2',
    borderWidth: 1.5,
    borderColor: '#FECDD3',
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    color: '#E11D48',
    fontSize: 15,
    fontWeight: '800',
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
    minHeight: 80,
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
  editActionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  saveButton: {
    flex: 2,
    backgroundColor: '#0EA5E9',
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 3,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: '#64748B',
    fontSize: 15,
    fontWeight: '700',
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
    padding: 22,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 6,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 10,
  },
  confirmDeleteMessage: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 21,
    marginBottom: 20,
  },
  modalActionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  confirmDeleteButton: {
    flex: 1,
    backgroundColor: '#E11D48',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmDeleteText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '700',
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
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  notFoundText: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '600',
  },
});
