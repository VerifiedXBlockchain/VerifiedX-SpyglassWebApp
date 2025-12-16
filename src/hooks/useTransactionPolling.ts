import { useState, useEffect, useRef, useCallback } from "react";
import { Transaction } from "../models/transaction";
import { TransactionService } from "../services/transaction-service";
import { POLLING_CONFIG } from "../constants/ui";

interface UseTransactionPollingResult {
  transaction: Transaction | undefined;
  loading: boolean;
  error: string | undefined;
  isPolling: boolean;
}

export const useTransactionPolling = (hash: string | string[] | undefined): UseTransactionPollingResult => {
  const [transaction, setTransaction] = useState<Transaction | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const [isPolling, setIsPolling] = useState<boolean>(false);

  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const clearIntervals = useCallback(() => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  }, []);

  const fetchTransaction = useCallback(async (isRetry: boolean = false) => {
    if (!hash) return;

    const service = new TransactionService();
    
    if (!isRetry) {
      setLoading(true);
      setError(undefined);
    }

    try {
      const data = await service.retrieve(hash.toString());
      
      // Additional check if transaction is complete (has essential fields)
      if (!data.isComplete()) {
        // Transaction is incomplete/not yet broadcasted, treat as error
        throw new Error("Transaction not yet broadcasted");
      }
      
      setTransaction(data);
      setLoading(false);
      setError(undefined);
      setIsPolling(false);
      clearIntervals();
    } catch (err) {
      console.error("Error fetching transaction:", err);
      
      if (!isRetry) {
        // First attempt failed - show pending state and start polling
        setError("Transaction pending - waiting for broadcast");
        setLoading(false);
      }
      // Continue polling for retries
    }
  }, [hash, clearIntervals]);

  const startPolling = useCallback(() => {
    if (isPolling) return;
    
    setIsPolling(true);
    
    // Start polling
    pollIntervalRef.current = setInterval(() => {
      fetchTransaction(true);
    }, POLLING_CONFIG.INTERVAL);
  }, [isPolling, fetchTransaction]);

  useEffect(() => {
    fetchTransaction();
    
    // Cleanup on unmount
    return () => {
      clearIntervals();
    };
  }, [hash, fetchTransaction, clearIntervals]);

  // Auto-start polling when error occurs (transaction pending)
  useEffect(() => {
    if (error && !isPolling && !loading) {
      startPolling();
    }
  }, [error, isPolling, loading, startPolling]);

  return {
    transaction,
    loading,
    error,
    isPolling
  };
};
