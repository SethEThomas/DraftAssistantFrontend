export const renderStarRating = (rating: number, maxRating: number = 5) => {
    const filledStars = Array(rating).fill('★'); // Unicode for filled star
    const emptyStars = Array(maxRating - rating).fill('☆'); // Unicode for empty star
    return [...filledStars, ...emptyStars].join(' ');
};
