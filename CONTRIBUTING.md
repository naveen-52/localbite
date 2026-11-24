# Contributing to LocalBite

Thank you for your interest in contributing to **LocalBite**! As an open-source initiative aimed at empowering roadside mini shops and micro-vendors, we welcome your contributions.

## Development Workflow

1. **Fork the Repository:** Create your own fork and clone it locally.
2. **Create a Feature Branch:**
   ```bash
   git checkout -b feat/your-feature-name
   ```
3. **Coding Standards:**
   - Follow SOLID and Clean Code principles.
   - Use standard Java records/classes and avoid reflection hacks.
   - On the frontend, strictly type all props and hooks using TypeScript.
   - Write comprehensive unit tests for any new business logic.
4. **Run Verification Before Committing:**
   ```bash
   # Backend checks
   cd backend && mvn test

   # Frontend build verification
   cd frontend && npm run build
   ```
5. **Commit Message Format (Conventional Commits):**
   - `feat(food): add bulk availability update endpoint`
   - `fix(timing): correct daylight saving edge case in shop hours`
   - `test(auth): add integration tests for refresh token rotation`
6. **Submit a Pull Request:** Explain the problem, the solution, and provide screenshots for UI changes.
