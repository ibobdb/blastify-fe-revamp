import {
  ImportIcon,
  TrashIcon,
  PlusIcon,
  CheckSquare,
  Square,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import AddContactDialog from './add-contact-dialog';
import { useConfirm } from '@/context/confirm.context';
import { ImportContactDialog } from './import-contact';
interface Contact {
  id: number;
  name: string;
  number: string;
  selected: boolean;
}

// Add prop type for callback
type BroadcastContactManagementProps = {
  onContactsChange?: (contacts: Contact[]) => void;
};

export default function BroadcastContactManagement({
  onContactsChange,
}: BroadcastContactManagementProps) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  // Track selected contacts count
  const [selectedCount, setSelectedCount] = useState(0);

  // Track if all contacts are selected
  const [allSelected, setAllSelected] = useState(false);

  // Dialog state
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  // Get confirmation dialog functionality
  const { confirmDanger } = useConfirm();
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');

  // Update selected count whenever contacts change
  useEffect(() => {
    const count = contacts.filter((c) => c.selected).length;
    setSelectedCount(count);
    setAllSelected(count > 0 && count === contacts.length);
    // Notify parent of all contacts
    if (onContactsChange) {
      onContactsChange(contacts);
    }
  }, [contacts, onContactsChange]);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearch(searchInput);
    }, 300); // 300ms debounce
    return () => clearTimeout(handler);
  }, [searchInput]);

  // Add new contact
  const handleAddContact = (
    newContact: { name: string; number: string },
    createAnother: boolean
  ) => {
    const newId =
      contacts.length > 0 ? Math.max(...contacts.map((c) => c.id)) + 1 : 1;
    setContacts((prev) => [
      ...prev,
      { ...newContact, id: newId, selected: false },
    ]);

    if (!createAnother) {
      setIsAddDialogOpen(false);
    }
  };
  // Remove single contact
  const handleRemoveContact = async (id: number) => {
    // Find the contact to get its name for the confirmation message
    const contactToRemove = contacts.find((contact) => contact.id === id);
    if (!contactToRemove) return;

    const confirmed = await confirmDanger(
      'Remove Contact',
      `Are you sure you want to remove ${contactToRemove.name}? This action cannot be undone.`,
      'Remove',
      () => {
        setContacts((prev) => prev.filter((contact) => contact.id !== id));
      }
    );

    // The callback handles the deletion if confirmed
    return confirmed;
  };

  // Toggle selection for a single contact
  const toggleContactSelection = (id: number) => {
    setContacts((prev) =>
      prev.map((contact) =>
        contact.id === id
          ? { ...contact, selected: !contact.selected }
          : contact
      )
    );
  };

  // Toggle selection for all contacts
  const toggleSelectAll = () => {
    const newSelectAll = !allSelected;
    setContacts((prev) =>
      prev.map((contact) => ({ ...contact, selected: newSelectAll }))
    );
  }; // Delete all selected contacts
  const deleteSelectedContacts = () => {
    // Don't do anything if no contacts are selected
    if (selectedCount === 0) return;

    // Get names of contacts to be deleted for a more informative confirmation message
    const selectedContacts = contacts.filter((contact) => contact.selected);
    const contactNames = selectedContacts
      .map((contact) => contact.name)
      .slice(0, 3); // Take only first 3 names for display

    let message = '';
    if (selectedCount === 1) {
      message = `Are you sure you want to delete the contact "${contactNames[0]}"? This action cannot be undone.`;
    } else if (selectedCount <= 3) {
      message = `Are you sure you want to delete these ${selectedCount} contacts: "${contactNames.join(
        '", "'
      )}"? This action cannot be undone.`;
    } else {
      message = `Are you sure you want to delete ${selectedCount} contacts, including "${contactNames.join(
        '", "'
      )}" and ${selectedCount - 3} more? This action cannot be undone.`;
    }

    // Use the confirmDanger function directly, without awaiting
    confirmDanger(
      'Delete Selected Contacts',
      message,
      'Delete',
      // This callback will be executed if the user confirms
      () => {
        setContacts((prev) => prev.filter((contact) => !contact.selected));
      }
    );
  };

  // Handler for imported contacts from ImportContactDialog
  const handleImportContacts = (
    imported: { name: string; number: string }[]
  ) => {
    // Avoid duplicates by number
    setContacts((prev) => {
      const existingNumbers = new Set(prev.map((c) => c.number));
      const newContacts = imported
        .filter((c) => !existingNumbers.has(c.number))
        .map((c, idx) => ({
          id: prev.length + idx + 1,
          name: c.name,
          number: c.number,
          selected: false,
        }));
      return [...prev, ...newContacts];
    });
  };

  // Filter contacts by search
  const filteredContacts = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.number.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className="border rounded-md p-3 h-[305px] dark:bg-gray-700 flex flex-col overflow-hidden"
      style={{ display: 'flex', flexDirection: 'column' }}
    >
      {/* Add Contact Dialog */}
      <AddContactDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSubmit={handleAddContact}
      />
      {/* Search and actions - fixed at the top */}
      <div className="flex justify-between items-center mb-2 flex-none">
        <div className="flex gap-2 items-center">
          <div className="w-[200px]">
            <input
              type="search"
              placeholder="Search contacts..."
              className="w-full px-2 py-1 border rounded-md text-sm"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>{' '}
          <button
            className="p-1.5 rounded-md border hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-blue-600"
            onClick={() => setIsAddDialogOpen(true)}
            title="Add Contact"
          >
            <PlusIcon size={14} />
          </button>
          {/* Import contact */}
          <ImportContactDialog
            className="p-1.5 rounded-md border hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            onSubmit={handleImportContacts}
          />
          <button
            className={`p-1.5 rounded-md border hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
              selectedCount > 0
                ? 'text-red-600'
                : 'text-gray-400 cursor-not-allowed'
            }`}
            onClick={deleteSelectedContacts}
            disabled={selectedCount === 0}
            title={
              selectedCount > 0
                ? `Delete ${selectedCount} selected contacts`
                : 'Select contacts to delete'
            }
          >
            <TrashIcon size={14} />
          </button>
        </div>
        <div className="text-xs text-gray-500 text-right">
          {selectedCount > 0 ? (
            <span className="font-medium">{selectedCount} selected</span>
          ) : (
            <span className="font-medium">{contacts.length} contacts</span>
          )}
        </div>
      </div>{' '}
      {/* Table for contacts with fixed headers */}
      <div className="flex flex-col min-w-full flex-1">
        {' '}
        {/* Fixed header with selection checkbox */}
        <div className="bg-white dark:bg-gray-800 text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider grid grid-cols-6 gap-2 p-1.5 border-b sticky top-0 z-10 flex-none">
          <div className="col-span-1 flex items-center">
            <button
              className="p-0.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              onClick={toggleSelectAll}
              title={allSelected ? 'Unselect all' : 'Select all'}
            >
              {allSelected ? (
                <CheckSquare size={14} className="text-blue-500" />
              ) : (
                <Square size={14} />
              )}
            </button>
          </div>
          <div className="col-span-4">Contact</div>
          <div className="col-span-1 text-right">Action</div>
        </div>{' '}
        {/* Scrollable contact list - explicitly set height */}
        <div
          className="space-y-0.5 pt-1 flex-1 overflow-y-auto custom-scrollbar"
          style={{ maxHeight: '225px', minHeight: '180px' }}
        >
          {/* Render contacts from state with checkboxes */}
          {filteredContacts.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm">
              No contacts found.
            </div>
          ) : (
            filteredContacts.map((contact) => (
              <div
                key={contact.id}
                className={`grid grid-cols-6 gap-2 p-2 ${
                  contact.selected
                    ? 'bg-blue-50 dark:bg-blue-900/20'
                    : 'bg-white dark:bg-gray-900'
                } rounded-md text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors`}
              >
                <div className="col-span-1 flex items-center">
                  <button
                    className="p-0.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                    onClick={() => toggleContactSelection(contact.id)}
                  >
                    {contact.selected ? (
                      <CheckSquare size={14} className="text-blue-500" />
                    ) : (
                      <Square size={14} />
                    )}
                  </button>
                </div>
                <div
                  className="col-span-4 truncate cursor-pointer"
                  onClick={() => toggleContactSelection(contact.id)}
                >
                  <div className="font-medium">{contact.name}</div>
                  <div className="text-xs text-gray-500">{contact.number}</div>
                </div>
                <div className="col-span-1 text-right">
                  <button
                    onClick={() => handleRemoveContact(contact.id)}
                    className="text-red-600 hover:text-red-800 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
