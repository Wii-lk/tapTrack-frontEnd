import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../common/Card';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';
import Alert from '../common/Alert';
import feeService from '../../services/feeService';

const FeePaymentForm = () => {
    const { studentId } = useParams();
    const navigate = useNavigate();

    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [payingAmount, setPayingAmount] = useState(0);

    // Items state: { id, description, amount, is_selected }
    const [items, setItems] = useState([]);

    // 1. Fetch Outstanding Fee Details
    useEffect(() => {
        const fetchDetails = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await feeService.getFeeDetailsForPayment(studentId);
                setDetails(response.data);
                setItems(response.data.outstanding_items);
                // Set initial paying amount to the full amount due
                const initialTotal = response.data.outstanding_items.reduce((sum, item) => sum + item.amount, 0);
                setPayingAmount(initialTotal);
            } catch (err) {
                setError(err.message || 'Failed to load fee details.');
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [studentId]);

    // 2. Recalculate Total on Item Selection Change
    useEffect(() => {
        const newTotal = items
            .filter(item => item.is_selected)
            .reduce((sum, item) => sum + item.amount, 0);
        // Automatically update paying amount, but only if the user hasn't started a partial payment
        if (!isSubmitting) { // Prevent resetting while submitting
             setPayingAmount(newTotal);
        }
    }, [items, isSubmitting]);

    const handleItemToggle = (itemId) => {
        setItems(prevItems =>
            prevItems.map(item =>
                item.id === itemId ? { ...item, is_selected: !item.is_selected } : item
            )
        );
    };
    
    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        const totalSelectedAmount = items
            .filter(item => item.is_selected)
            .reduce((sum, item) => sum + item.amount, 0);
        
        if (payingAmount <= 0) {
             setError('Payment amount must be greater than zero.');
             return;
        }

        if (payingAmount > totalSelectedAmount) {
             setError('Payment amount cannot exceed the total selected due amount.');
             return;
        }
        
        setIsSubmitting(true);
        setError('');
        setSuccess('');

        const paymentData = {
            student_id: details.student_id,
            paying_amount: parseFloat(payingAmount),
            fee_items_paid: items.filter(item => item.is_selected).map(item => item.id),
            // Add payment method, date, etc., here in a real form
        };

        try {
            const response = await feeService.submitPayment(paymentData);
            setSuccess(response.message);
            // Optionally clear the form or navigate away
            setTimeout(() => navigate('/fees'), 2000);
        } catch (err) {
            setError(err.message || 'Failed to process payment.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return <LoadingSpinner text="Loading fee details..." />;
    }

    if (error && !details) {
        return <Alert type="error" message={error} className="mt-8" />;
    }

    const netTotalDue = items
        .filter(item => item.is_selected)
        .reduce((sum, item) => sum + item.amount, 0);

    return (
        <Card title={`Process Payment for ${details.student_name}`} subtitle={`Student ID: ${details.student_id}`}>
            <form onSubmit={handlePaymentSubmit} className="space-y-6">
                {error && <Alert type="error" message={error} onClose={() => setError('')} />}
                {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}
                
                {/* Items to Pay */}
                <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Outstanding Fee Items</h3>
                <div className="space-y-3">
                    {items.map((item) => (
                        <div key={item.id} className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50">
                            <label className="flex items-center space-x-3 text-sm font-medium text-gray-900">
                                <input
                                    type="checkbox"
                                    checked={item.is_selected}
                                    onChange={() => handleItemToggle(item.id)}
                                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                />
                                <span>{item.description}</span>
                            </label>
                            <span className="text-sm font-semibold">LKR {item.amount.toLocaleString()}</span>
                        </div>
                    ))}
                </div>

                {/* Net Amount Due */}
                <div className="flex justify-between items-center p-4 bg-indigo-50 rounded-lg font-bold text-indigo-800">
                    <span>Net Amount Due (Selected)</span>
                    <span>LKR {netTotalDue.toLocaleString()}</span>
                </div>

                {/* Paying Amount Input */}
                <div className="pt-4 border-t">
                    <label htmlFor="payingAmount" className="block text-sm font-medium text-gray-700 mb-2">
                        Paying Amount
                    </label>
                    <input
                        id="payingAmount"
                        type="number"
                        step="0.01"
                        min="0"
                        max={netTotalDue}
                        value={payingAmount}
                        onChange={(e) => setPayingAmount(e.target.value)}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:ring-indigo-500 focus:border-indigo-500"
                    />
                     <p className="mt-1 text-sm text-gray-500">
                        Enter the amount the student is paying. Allows for partial payment (must be $\le$ net total).
                    </p>
                </div>

                {/* Submit Button */}
                <Button 
                    type="submit" 
                    variant="primary" 
                    className="w-full py-3 text-lg"
                    disabled={isSubmitting || netTotalDue <= 0 || payingAmount <= 0}
                >
                    {isSubmitting ? <LoadingSpinner size="sm" /> : `Process Payment (LKR ${parseFloat(payingAmount).toLocaleString()})`}
                </Button>
                
                <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => navigate('/fees')}
                    className="w-full"
                >
                    Cancel
                </Button>
            </form>
        </Card>
    );
};

export default FeePaymentForm;