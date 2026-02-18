-- ============================================================================
-- SOCIAL NETWORK - DATABASE SCHEMA
-- ============================================================================
-- Ce schéma représente une portion simplifiée de la base de données
-- en adéquation avec les portions de code backend présentées
-- dans ce portfolio.
--
-- Il illustre :
-- - La modélisation relationnelle
-- - Les relations entre entités principales (users, posts, comments)
-- - Les relations N-N (likes, follows)
-- - L’intégrité référentielle
-- - La hiérarchie des commentaires
--
-- Il ne s'agit pas de la base complète d'une application en production,
-- mais d’un exemple cohérent permettant de démontrer la compréhension
-- de l’architecture backend associée.
-- ============================================================================


-- ============================================================================
-- EXTENSIONS
-- ============================================================================

-- Permet email insensible à la casse
CREATE EXTENSION IF NOT EXISTS citext;


-- ============================================================================
-- USERS
-- ============================================================================

CREATE TABLE users (
    id SERIAL PRIMARY KEY,

    email CITEXT UNIQUE NOT NULL, -- insensible à la casse
    password_hash TEXT NOT NULL,  -- hash bcrypt/argon2

    pseudo VARCHAR(100) NOT NULL,
    alias VARCHAR(100),
    bio TEXT,
    profile_picture TEXT,

    is_certified BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);


-- ============================================================================
-- POSTS
-- ============================================================================

CREATE TABLE posts (
    id SERIAL PRIMARY KEY,

    author_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_post_author
        FOREIGN KEY (author_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE INDEX idx_posts_author_id ON posts(author_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);


-- ============================================================================
-- COMMENTS (hiérarchie via parent_id)
-- ============================================================================

CREATE TABLE comments (
    id SERIAL PRIMARY KEY,

    post_id INTEGER NOT NULL,
    author_id INTEGER NOT NULL,
    parent_id INTEGER NULL, -- null = commentaire racine

    content TEXT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_comment_post
        FOREIGN KEY (post_id)
        REFERENCES posts(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_comment_author
        FOREIGN KEY (author_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_comment_parent
        FOREIGN KEY (parent_id)
        REFERENCES comments(id)
        ON DELETE CASCADE
);

CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_parent_id ON comments(parent_id);


-- ============================================================================
-- POST LIKES (relation N-N user ↔ post)
-- ============================================================================

CREATE TABLE post_likes (
    user_id INTEGER NOT NULL,
    post_id INTEGER NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (user_id, post_id),

    CONSTRAINT fk_post_like_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_post_like_post
        FOREIGN KEY (post_id)
        REFERENCES posts(id)
        ON DELETE CASCADE
);

CREATE INDEX idx_post_likes_post_id ON post_likes(post_id);


-- ============================================================================
-- COMMENT LIKES (relation N-N user ↔ comment)
-- ============================================================================

CREATE TABLE comment_likes (
    user_id INTEGER NOT NULL,
    comment_id INTEGER NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (user_id, comment_id),

    CONSTRAINT fk_comment_like_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_comment_like_comment
        FOREIGN KEY (comment_id)
        REFERENCES comments(id)
        ON DELETE CASCADE
);

CREATE INDEX idx_comment_likes_comment_id ON comment_likes(comment_id);


-- ============================================================================
-- FOLLOWS (relation N-N user ↔ user)
-- ============================================================================

CREATE TABLE follows (
    follower_id INTEGER NOT NULL,
    followed_id INTEGER NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (follower_id, followed_id),

    CONSTRAINT fk_follower
        FOREIGN KEY (follower_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_followed
        FOREIGN KEY (followed_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT no_self_follow
        CHECK (follower_id <> followed_id)
);

CREATE INDEX idx_follows_follower_id ON follows(follower_id);
CREATE INDEX idx_follows_followed_id ON follows(followed_id);


-- ============================================================================
-- TRIGGER POUR updated_at AUTOMATIQUE
-- ============================================================================

CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trigger_posts_updated_at
BEFORE UPDATE ON posts
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trigger_comments_updated_at
BEFORE UPDATE ON comments
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();


-- ============================================================================
-- END OF SCHEMA
-- ============================================================================

