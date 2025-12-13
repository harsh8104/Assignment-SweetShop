# Deployment Guide

This guide covers deploying the Sweet Shop Management System to production.

## Deployment Options

### Option 1: Deploy to Heroku + MongoDB Atlas

#### Prerequisites

- Heroku account
- Heroku CLI installed
- MongoDB Atlas account

#### Step 1: Set up MongoDB Atlas

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a database user
3. Whitelist all IPs (0.0.0.0/0) for development
4. Get your connection string

#### Step 2: Deploy Backend to Heroku

```bash
cd backend

# Login to Heroku
heroku login

# Create Heroku app
heroku create sweetshop-backend

# Set environment variables
heroku config:set MONGODB_URI="your_mongodb_atlas_connection_string"
heroku config:set JWT_SECRET="your_production_jwt_secret"
heroku config:set NODE_ENV="production"

# Create Procfile
echo "web: node src/server.js" > Procfile

# Deploy
git add .
git commit -m "Configure for Heroku deployment"
git push heroku master

# Open app
heroku open
```

#### Step 3: Deploy Frontend to Vercel

```bash
cd frontend

# Install Vercel CLI
npm install -g vercel

# Update API URL for production
# Create .env.production
echo "REACT_APP_API_URL=https://sweetshop-backend.herokuapp.com/api" > .env.production

# Deploy
vercel --prod
```

### Option 2: Deploy to Render

#### Backend Deployment

1. Go to [Render](https://render.com)
2. Create a new Web Service
3. Connect your GitHub repository
4. Configure:
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Environment Variables**:
     - `MONGODB_URI`: Your MongoDB connection string
     - `JWT_SECRET`: Your secret key
     - `NODE_ENV`: production

#### Frontend Deployment

1. Create a new Static Site on Render
2. Configure:
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/build`
   - **Environment Variables**:
     - `REACT_APP_API_URL`: Your backend URL

### Option 3: Deploy to AWS (EC2 + RDS/DocumentDB)

#### Prerequisites

- AWS account
- EC2 instance running
- MongoDB or DocumentDB instance

#### Backend Setup

```bash
# SSH into EC2 instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Clone repository
git clone your-repo-url
cd Assignment/backend

# Install dependencies
npm install

# Create .env file
nano .env
# Add your production environment variables

# Start with PM2
pm2 start src/server.js --name sweetshop-api
pm2 startup
pm2 save

# Configure Nginx as reverse proxy
sudo apt install nginx
sudo nano /etc/nginx/sites-available/sweetshop

# Add configuration:
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Enable site
sudo ln -s /etc/nginx/sites-available/sweetshop /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### Frontend Setup

```bash
# Build frontend locally
cd frontend
npm run build

# Upload build folder to S3 or serve via Nginx
# For S3 + CloudFront:
aws s3 sync build/ s3://your-bucket-name --delete
```

## Environment Variables

### Backend (.env)

```
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sweetshop
JWT_SECRET=your_very_long_and_random_secret_key_here
NODE_ENV=production
```

### Frontend (.env.production)

```
REACT_APP_API_URL=https://your-backend-url.com/api
```

## Production Checklist

- [ ] Update MONGODB_URI to production database
- [ ] Generate strong JWT_SECRET (use: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`)
- [ ] Set NODE_ENV to "production"
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS for production domain
- [ ] Set up database backups
- [ ] Configure logging and monitoring
- [ ] Set up error tracking (e.g., Sentry)
- [ ] Enable rate limiting
- [ ] Configure firewall rules
- [ ] Set up CI/CD pipeline
- [ ] Add security headers

## Security Recommendations

1. **Use HTTPS**: Always use SSL/TLS in production
2. **Environment Variables**: Never commit secrets to Git
3. **Database**: Use strong passwords and restrict IP access
4. **JWT Secret**: Use a long random string (64+ characters)
5. **Rate Limiting**: Implement rate limiting for API endpoints
6. **Helmet**: Use helmet middleware for security headers
7. **CORS**: Configure CORS to only allow your frontend domain
8. **Input Validation**: Already implemented with express-validator
9. **MongoDB**: Use MongoDB Atlas with IP whitelisting
10. **Backups**: Set up automated database backups

## Monitoring

### Backend Health Check

```bash
curl https://your-backend-url.com/
# Should return: {"message":"Welcome to Sweet Shop API"}
```

### Check Logs (Heroku)

```bash
heroku logs --tail -a sweetshop-backend
```

### Check Logs (PM2)

```bash
pm2 logs sweetshop-api
```

## Troubleshooting

### CORS Issues

Add your frontend URL to CORS whitelist in `backend/src/server.js`:

```javascript
app.use(
  cors({
    origin: "https://your-frontend-url.com",
    credentials: true,
  })
);
```

### Database Connection Errors

- Verify MongoDB URI format
- Check IP whitelist in MongoDB Atlas
- Ensure database user has correct permissions

### API Not Responding

- Check if backend is running: `pm2 status`
- Verify environment variables are set
- Check firewall rules and security groups

## Performance Optimization

1. **Enable Gzip Compression**
2. **Use CDN for Static Assets**
3. **Implement Caching**
4. **Database Indexing**: Already configured in models
5. **Optimize Images**: Use WebP format
6. **Minimize Bundle Size**: Run `npm run build` with production flag

## Maintenance

### Update Dependencies

```bash
# Backend
cd backend
npm update
npm audit fix

# Frontend
cd frontend
npm update
npm audit fix
```

### Backup Database

```bash
# MongoDB Atlas: Use built-in backup
# Self-hosted: Use mongodump
mongodump --uri="mongodb://..." --out=/backup/location
```

---

**Live Demo**: [Coming Soon]

**Backend API**: [Coming Soon]
