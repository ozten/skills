#!/bin/bash
# Check nano-banana-image-gen dependencies on session start

MISSING=""

# Check Python package
python3 -c "from google import genai" 2>/dev/null || MISSING="google-genai"

# Check API key
if [ -z "$GOOGLE_API_KEY" ] && [ -z "$GEMINI_API_KEY" ]; then
    MISSING="$MISSING api-key"
fi

# Only print if something is missing
if [ -n "$MISSING" ]; then
    echo ""
    echo "━━━ nano-banana-image-gen ━━━"
    
    if [[ "$MISSING" == *"google-genai"* ]]; then
        echo "⚠️  Missing: google-genai pillow"
        echo "   Install: pip install google-genai pillow"
        echo "       or:  uv add google-genai pillow"
    fi
    
    if [[ "$MISSING" == *"api-key"* ]]; then
        echo "⚠️  Missing: GOOGLE_API_KEY or GEMINI_API_KEY"
        echo "   Set:     export GOOGLE_API_KEY='your-key'"
    fi
    
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
fi
