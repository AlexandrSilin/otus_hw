import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  createContragent,
  deleteContragent,
  getContragents,
  updateContragent,
} from '../api/contragentsApi';

const ContragentsContext = createContext(null);

export function ContragentsProvider({ children }) {
  const [contragents, setContragents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadContragents = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getContragents();
      setContragents(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadContragents();
  }, [loadContragents]);

  const addContragent = useCallback(async (data) => {
    const created = await createContragent(data);
    setContragents((prev) => [...prev, created]);
    return created;
  }, []);

  const editContragent = useCallback(async (data) => {
    const updated = await updateContragent(data);
    setContragents((prev) =>
      prev.map((item) => (String(item.id) === String(updated.id) ? updated : item)),
    );
    return updated;
  }, []);

  const removeContragent = useCallback(async (id) => {
    await deleteContragent(id);
    setContragents((prev) => prev.filter((item) => String(item.id) !== String(id)));
  }, []);

  const value = useMemo(
    () => ({
      contragents,
      loading,
      error,
      loadContragents,
      addContragent,
      editContragent,
      removeContragent,
    }),
    [
      contragents,
      loading,
      error,
      loadContragents,
      addContragent,
      editContragent,
      removeContragent,
    ],
  );

  return (
    <ContragentsContext.Provider value={value}>
      {children}
    </ContragentsContext.Provider>
  );
}

export function useContragents() {
  const context = useContext(ContragentsContext);

  if (!context) {
    throw new Error('useContragents must be used within ContragentsProvider');
  }

  return context;
}
