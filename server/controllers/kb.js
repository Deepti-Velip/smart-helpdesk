import Article from "../models/kb.js";

export const getArticles = async (req, res) => {
  try {
    const query = req.query.query?.toLowerCase() || "";
    const status = req.query.status;

    let filter = {
      $or: [
        { title: new RegExp(query, "i") },
        { body: new RegExp(query, "i") },
        { tags: { $in: [query] } },
      ],
    };

    if (status) {
      filter.status = status;
    }

    const articles = await Article.find(filter).sort({ updatedAt: -1 });
    res.json(articles);
  } catch (err) {
    res.status(500).json({ message: "Error fetching articles", error: err });
  }
};

// Create a new article
export const createArticle = async (req, res) => {
  try {
    const article = new Article(req.body);
    await article.save();
    res.status(201).json(article);
  } catch (err) {
    res.status(500).json({ message: "Error creating article", error: err });
  }
};

// Update an article
export const updateArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(article);
  } catch (err) {
    res.status(500).json({ message: "Error updating article", error: err });
  }
};

// Delete an article
export const deleteArticle = async (req, res) => {
  try {
    await Article.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: "Error deleting article", error: err });
  }
};
