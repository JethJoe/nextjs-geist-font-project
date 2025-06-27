-- BiteBantu Database Schema

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    language VARCHAR(10) DEFAULT 'en',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Addresses table
CREATE TABLE IF NOT EXISTS addresses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    street_address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20),
    country VARCHAR(100) DEFAULT 'Kenya',
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    name_sw VARCHAR(100), -- Swahili translation
    description TEXT,
    image_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Restaurants table
CREATE TABLE IF NOT EXISTS restaurants (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    rating DECIMAL(2,1) DEFAULT 0.0,
    review_count INTEGER DEFAULT 0,
    cuisine_type VARCHAR(100),
    delivery_time_min INTEGER DEFAULT 30,
    delivery_time_max INTEGER DEFAULT 45,
    delivery_fee DECIMAL(10,2) DEFAULT 0.00,
    minimum_order DECIMAL(10,2) DEFAULT 0.00,
    is_sponsored BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Menu items table
CREATE TABLE IF NOT EXISTS menu_items (
    id SERIAL PRIMARY KEY,
    restaurant_id INTEGER REFERENCES restaurants(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES categories(id),
    name VARCHAR(255) NOT NULL,
    name_sw VARCHAR(255), -- Swahili translation
    description TEXT,
    description_sw TEXT, -- Swahili translation
    price DECIMAL(10,2) NOT NULL,
    image_url VARCHAR(255),
    is_available BOOLEAN DEFAULT TRUE,
    is_vegetarian BOOLEAN DEFAULT FALSE,
    is_vegan BOOLEAN DEFAULT FALSE,
    allergens TEXT[], -- Array of allergens
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    restaurant_id INTEGER REFERENCES restaurants(id),
    address_id INTEGER REFERENCES addresses(id),
    status VARCHAR(50) DEFAULT 'pending', -- pending, confirmed, preparing, out_for_delivery, delivered, cancelled
    subtotal DECIMAL(10,2) NOT NULL,
    delivery_fee DECIMAL(10,2) DEFAULT 0.00,
    tax DECIMAL(10,2) DEFAULT 0.00,
    total DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'cash', -- cash, card, mobile_money
    payment_status VARCHAR(50) DEFAULT 'pending', -- pending, paid, failed
    special_instructions TEXT,
    estimated_delivery_time TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_id INTEGER REFERENCES menu_items(id),
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    special_instructions TEXT
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    restaurant_id INTEGER REFERENCES restaurants(id) ON DELETE CASCADE,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Coupons table
CREATE TABLE IF NOT EXISTS coupons (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    discount_type VARCHAR(20) DEFAULT 'percentage', -- percentage, fixed
    discount_value DECIMAL(10,2) NOT NULL,
    minimum_order DECIMAL(10,2) DEFAULT 0.00,
    max_discount DECIMAL(10,2),
    usage_limit INTEGER,
    used_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User coupons (tracking which users used which coupons)
CREATE TABLE IF NOT EXISTS user_coupons (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    coupon_id INTEGER REFERENCES coupons(id) ON DELETE CASCADE,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, coupon_id, order_id)
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_menu_items_restaurant_id ON menu_items(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_category_id ON menu_items(category_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_reviews_restaurant_id ON reviews(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON addresses(user_id);

-- Insert sample data
INSERT INTO categories (name, name_sw, description) VALUES
('Burgers', 'Hamburger', 'Delicious burgers and sandwiches'),
('Pizza', 'Pizza', 'Fresh pizzas with various toppings'),
('Japanese', 'Kijapani', 'Authentic Japanese cuisine'),
('Italian', 'Kiitaliano', 'Traditional Italian dishes'),
('Asian', 'Kiasia', 'Various Asian cuisines'),
('American', 'Kimarekani', 'Classic American food');

INSERT INTO restaurants (name, description, image_url, rating, review_count, cuisine_type, delivery_time_min, delivery_time_max, delivery_fee, minimum_order, is_sponsored) VALUES
('Burger Palace', 'Home of the best burgers in town', 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg', 4.5, 1000, 'Burgers', 20, 35, 2.50, 10.00, true),
('Pizza Heaven', 'Authentic Italian pizzas made fresh', 'https://images.pexels.com/photos/825661/pexels-photo-825661.jpeg', 4.3, 500, 'Pizza', 30, 45, 3.00, 15.00, false),
('Sushi Master', 'Fresh sushi and Japanese delicacies', 'https://images.pexels.com/photos/2098085/pexels-photo-2098085.jpeg', 4.7, 2000, 'Japanese', 25, 40, 4.00, 20.00, true);

INSERT INTO menu_items (restaurant_id, category_id, name, name_sw, description, description_sw, price, image_url, is_vegetarian) VALUES
(1, 1, 'Classic Burger', 'Hamburger ya Kawaida', 'Beef patty with lettuce, tomato, and cheese', 'Nyama ya ng''ombe na mboga', 12.99, 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg', false),
(1, 1, 'Veggie Burger', 'Hamburger ya Mboga', 'Plant-based patty with fresh vegetables', 'Hamburger ya mimea na mboga mpya', 11.99, 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg', true),
(2, 2, 'Margherita Pizza', 'Pizza ya Margherita', 'Classic pizza with tomato, mozzarella, and basil', 'Pizza ya kawaida na nyanya, jibini na basil', 14.99, 'https://images.pexels.com/photos/825661/pexels-photo-825661.jpeg', true),
(2, 2, 'Pepperoni Pizza', 'Pizza ya Pepperoni', 'Pizza topped with pepperoni and cheese', 'Pizza na pepperoni na jibini', 16.99, 'https://images.pexels.com/photos/825661/pexels-photo-825661.jpeg', false),
(3, 3, 'Salmon Sushi Roll', 'Sushi ya Samoni', 'Fresh salmon with rice and nori', 'Samoni mpya na mchele', 18.99, 'https://images.pexels.com/photos/2098085/pexels-photo-2098085.jpeg', false),
(3, 3, 'Vegetable Sushi Roll', 'Sushi ya Mboga', 'Mixed vegetables with rice and nori', 'Mboga mchanganyiko na mchele', 15.99, 'https://images.pexels.com/photos/2098085/pexels-photo-2098085.jpeg', true);

INSERT INTO coupons (code, description, discount_type, discount_value, minimum_order, max_discount, usage_limit, expires_at) VALUES
('WELCOME20', '20% off your first order', 'percentage', 20.00, 15.00, 10.00, 1000, '2025-12-31 23:59:59'),
('FREEDELIV', 'Free delivery on orders over $25', 'fixed', 5.00, 25.00, 5.00, 500, '2025-06-30 23:59:59'),
('SAVE5', '$5 off orders over $30', 'fixed', 5.00, 30.00, 5.00, 1000, '2025-12-31 23:59:59');
