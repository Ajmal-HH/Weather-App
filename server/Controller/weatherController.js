import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const addFavoriteCity = async (req, res) => {
  try {
    const { place } = req.body;
    const userId = req.user.userId;

    const count = await prisma.favorite.count();

    if (count < 3) {
      // Check if the favorite city already exists for this user
      const existingFavorite = await prisma.favorite.findFirst({
        where: {
          userId: userId,
          city: place,
        },
      });

      if (existingFavorite) {
        return res.status(400).json({ message: 'City is already in favorites' });
      }

      const favorite = await prisma.favorite.create({
          data: {
            city: place,
            userId,
          },
      });

      res.status(201).json(favorite);
    } else {
      res.status(403).json({ message: 'Favorite city limit is exceeded' })
    }
  } catch (error) {
    res.status(500).json({ message: 'An error occurred, please try again later' });
    console.log("error in addFavoriteCity:", error.message);
  }
};


const getFavoriteCity = async (req, res) => {
  try {
    const userId = req.user.userId;

    const favorites = await prisma.favorite.findMany({
      where: { userId },
    });


    res.json(favorites);
  } catch (error) {
    console.log("error in getFavoriteCity :", error.message);
  }
}


const removeFavCity = async (req, res) => {
  try {
    const { place } = req.body;
    const userId = req.user.userId;

    const deletedFavorite = await prisma.favorite.deleteMany({
      where: {
        userId: userId,
        city: place,
      },
    });

    res.status(200).json({ status: true });
  } catch (error) {
    console.log('Error from removeFavCity:', error.message);
    res.status(500).json({ error: 'An error occurred. Please try again later.' });
  }
};

export {
  addFavoriteCity,
  getFavoriteCity,
  removeFavCity
}