#!/bin/bash
# Check nano-banana-image-gen dependencies on session start

MISSING=""

# Check imagen binary
if ! command -v imagen &>/dev/null; then
    MISSING="imagen-cli"
fi

# Check for at least one API key (env vars or config file)
HAS_KEY=""
if [ -n "$GEMINI_API_KEY" ] || [ -n "$OPENAI_API_KEY" ]; then
    HAS_KEY="yes"
elif [ -f "$HOME/.config/imagen/config.toml" ]; then
    # Check if config file has any non-placeholder key values
    if grep -qE '^(gemini|openai)\s*=\s*"[^"]*[^your-]' "$HOME/.config/imagen/config.toml" 2>/dev/null; then
        HAS_KEY="yes"
    fi
fi

if [ -z "$HAS_KEY" ]; then
    MISSING="$MISSING api-key"
fi

# Only print if something is missing
if [ -n "$MISSING" ]; then
    echo ""
    echo "--- nano-banana-image-gen ---"

    if [[ "$MISSING" == *"imagen-cli"* ]]; then
        echo "  Missing: imagen CLI"
        echo "  Install: curl -fsSL https://raw.githubusercontent.com/ozten/imagen/main/scripts/install.sh | bash"
    fi

    if [[ "$MISSING" == *"api-key"* ]]; then
        echo "  Missing: API key (GEMINI_API_KEY or OPENAI_API_KEY)"
        echo "  Set env: export GEMINI_API_KEY='your-key'"
        echo "  Or edit: ~/.config/imagen/config.toml"
    fi

    echo "----------------------------"
    echo ""
fi
