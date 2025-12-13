# Sweet Shop Management System - Contributing Guide

## How to Contribute

Thank you for considering contributing to the Sweet Shop Management System!

## Development Workflow

### 1. Fork and Clone

```bash
git clone <your-fork-url>
cd Assignment
```

### 2. Create a Branch

```bash
git checkout -b feature/your-feature-name
```

### 3. Follow TDD

- Write tests first (Red)
- Implement feature (Green)
- Refactor code (Refactor)

### 4. Code Style

#### Backend (Node.js)

- Use ES6+ features
- Follow ESLint rules
- Add JSDoc comments
- Use async/await for promises

#### Frontend (React)

- Use functional components
- Follow React hooks best practices
- Add PropTypes or TypeScript
- Keep components small and focused

### 5. Commit Messages

Follow conventional commits:

```
feat: Add new feature
fix: Fix bug
docs: Update documentation
test: Add tests
refactor: Refactor code
style: Format code
chore: Update dependencies
```

### 6. AI Co-authorship

If you use AI tools, add co-author:

```bash
git commit -m "feat: Your message

Co-authored-by: AI Tool <ai@example.com>"
```

### 7. Pull Request

- Ensure all tests pass
- Update documentation
- Add screenshots for UI changes
- Reference related issues

## Code Review Checklist

- [ ] Tests pass
- [ ] Code is well-documented
- [ ] Follows project conventions
- [ ] No security vulnerabilities
- [ ] Performance is acceptable
- [ ] Accessibility considered
- [ ] Responsive design maintained

## Testing Requirements

- All new features must have tests
- Maintain test coverage > 80%
- Tests should be meaningful
- Follow existing test patterns

## Questions?

Open an issue for discussion!

---

**Happy Contributing!** 🚀
