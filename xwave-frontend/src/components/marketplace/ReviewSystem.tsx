import { useState, FormEvent } from 'react';
import { StarIcon } from '@heroicons/react/solid';
import { useBlockchain } from '../../contexts/BlockchainContext';

// Definir los tipos para las props del componente
interface ReviewSystemProps {
  contentId: string; // Asegúrate de que contentId sea un string, puedes ajustarlo si es necesario
  onReviewSubmitted: () => void;
}

export function ReviewSystem({ contentId, onReviewSubmitted }: ReviewSystemProps) {
  const { account } = useBlockchain(); // Suponiendo que `account` es un string
  const [rating, setRating] = useState<number>(0); // El estado de rating es un número
  const [comment, setComment] = useState<string>(''); // El estado de comment es un string
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // El estado de isSubmitting es un booleano

  // Definir el tipo para el evento de submit
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await submitReview({
        contentId,
        rating,
        comment,
        reviewer: account,
      });
      
      setRating(0);
      setComment('');
      onReviewSubmitted();
    } catch (error) {
      console.error('Failed to submit review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white shadow sm:rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900">Write a Review</h3>
      
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div>
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <StarIcon
                key={star}
                className={`h-8 w-8 cursor-pointer ${
                  star <= rating ? 'text-yellow-400' : 'text-gray-300'
                }`}
                onClick={() => setRating(star)}
              />
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
            Comment
          </label>
          <textarea
            id="comment"
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !rating}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
}
function submitReview(_arg0: { contentId: string; rating: number; comment: string; reviewer: string | null; }) {
  throw new Error('Function not implemented.');
}

