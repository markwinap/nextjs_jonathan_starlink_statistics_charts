# Scheduled Data Collection

This project includes a scheduled function that automatically collects satellite statistics data every 24 hours and stores it in the database.

## How It Works

1. **Scheduler Endpoint**: `/api/scheduler`
   - Fetches data from `/api/current` endpoint
   - Stores the data in the Prisma database
   - Runs automatically every 24 hours via Vercel Cron Jobs

2. **Data Flow**:
   ```
   External API → /api/current → /api/scheduler → Prisma Database
   ```

3. **Scheduling**:
   - Configured in `vercel.json` to run daily at midnight UTC
   - Cron expression: `0 0 * * *` (runs at 00:00 UTC every day)

## Configuration

### Environment Variables

Add these optional environment variables to your `.env` file:

```bash
# Optional: Secret for securing the scheduler endpoint
CRON_SECRET="your-secure-random-string"

# Optional: Base URL for your app (auto-detected in most cases)
NEXTAUTH_URL="https://your-app-domain.com"
```

### Vercel Deployment

The scheduler is configured in `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/scheduler",
      "schedule": "0 0 * * *"
    }
  ]
}
```

## Testing

### Manual Testing

1. **Test the scheduler manually**:
   ```
   GET /api/test-scheduler
   ```
   This endpoint will trigger the scheduler and return the results.

2. **Direct scheduler call**:
   ```
   GET /api/scheduler
   ```
   You can call this directly, but make sure to include the authorization header if `CRON_SECRET` is set.

### Local Development Testing

For testing locally, you can:

1. Run the development server:
   ```bash
   npm run dev
   ```

2. Visit `http://localhost:3000/api/test-scheduler` to test the scheduler

3. Or use curl:
   ```bash
   curl http://localhost:3000/api/test-scheduler
   ```

## Database Schema

The data is stored in the `Stats` table with the following structure:

- `timestamp`: When the data was collected
- `mission`: Mission name (e.g., "Starlink Group 10-13")
- Various satellite statistics fields
- Automatically prevents duplicate entries within the same hour

## Error Handling

The scheduler includes comprehensive error handling:

- **Network Errors**: Logged and returned in the response
- **Database Errors**: Caught and logged with detailed messages  
- **Duplicate Prevention**: Checks for existing data within the same hour
- **Authentication**: Optional bearer token authentication for security

## Monitoring

- All operations are logged to the console
- Success/failure status is returned in the JSON response
- Timestamps are included for tracking when operations occur

## Alternative Scheduling Options

If you're not using Vercel, you can implement scheduling using:

1. **Node-cron** (for self-hosted applications)
2. **External cron services** (like cron-job.org)
3. **Cloud provider schedulers** (AWS EventBridge, Google Cloud Scheduler)
4. **GitHub Actions** with scheduled workflows

## Security Notes

- Use `CRON_SECRET` environment variable to secure the scheduler endpoint
- The scheduler only accepts GET and POST requests
- Consider rate limiting if exposing the endpoint publicly
- Monitor logs for any suspicious activity