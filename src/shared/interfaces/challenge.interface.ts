export interface Challenge {
    id: string;
    recipeId: string;
    progress: number;
    goal: number;
    description: string;
    imageUrl?: string;
}