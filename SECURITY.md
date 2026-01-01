# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability, please report it via GitHub Issues or email.

## Known Issues

### Exposed Google API Key (Resolved)

**Date**: December 31, 2025  
**Commit**: `1882381`  
**Status**: ✅ **RESOLVED**

**Description**:
A Google Gemini API key was exposed in commit `1882381` during initial development.

**Remediation**:
1. ✅ API key has been **revoked** from Google AI Studio
2. ✅ Project migrated to **Azure OpenAI** (serverless API proxy)
3. ✅ All API keys now managed via **Azure App Settings** (environment variables)
4. ✅ No API keys in current codebase

**Current Security Measures**:
- API keys stored in Azure App Settings (server-side only)
- `local.settings.json` added to `.gitignore`
- Circuit Breaker and Rate Limiting implemented
- Regular security audits via GitGuardian

**Risk Assessment**: 🟢 **Low**
- Exposed key is no longer active
- Current architecture prevents API key exposure
- Azure OpenAI provides better security controls

---

## Best Practices

### For Contributors

1. **Never commit API keys** to Git
2. Use environment variables for sensitive data
3. Review `.gitignore` before committing
4. Run `git diff` before pushing

### For Forkers/Deployers

1. Generate your own Azure OpenAI API key
2. Store in Azure Static Web Apps → Configuration → Application Settings
3. Never hardcode keys in `index.html` or `api/` code

---

## Security Tools

- **GitGuardian**: Automated secret scanning
- **Azure Key Vault**: Future key management (planned)
- **Dependabot**: Dependency vulnerability alerts

---

## Contact

Security concerns: [GitHub Issues](https://github.com/zer0big/MetalGlyphs/issues)
