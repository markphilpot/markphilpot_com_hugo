import React, { useState, useEffect } from 'react';
import { Box, Text, useInput, useApp } from 'ink';
import TextInput from 'ink-text-input';
import { truncateContent } from '../common.js';
import * as mastodon from '../mastodon.js';
import * as bluesky from '../bluesky.js';

interface PostData {
  content: string;
  platforms: {
    mastodon: boolean;
    bluesky: boolean;
  };
  includeBacklink: boolean;
}

interface CrossPostUIProps {
  textbundlePath: string;
  initialContent: string;
  backlink: string;
  onSubmit: (postData: PostData) => Promise<void>;
  onCancel: () => void;
}

type FocusedField = 'text' | 'backlink' | 'mastodon' | 'bluesky' | 'submit' | 'cancel';

interface UIState {
  postText: string;
  includeBacklink: boolean;
  platforms: {
    mastodon: boolean;
    bluesky: boolean;
  };
  focusedField: FocusedField;
  isEditing: boolean;
  charLimits: {
    mastodon: number;
    bluesky: number;
  };
}

const CrossPostUI: React.FC<CrossPostUIProps> = ({ textbundlePath, initialContent, backlink, onSubmit, onCancel }) => {
  const { exit } = useApp();

  const [state, setState] = useState<UIState>({
    postText: initialContent,
    includeBacklink: true,
    platforms: {
      mastodon: true,
      bluesky: true,
    },
    focusedField: 'text',
    isEditing: false,
    charLimits: {
      mastodon: 500,
      bluesky: 300,
    },
  });

  // Fetch Mastodon character limit on mount
  useEffect(() => {
    mastodon.getCharLimit().then(limit => {
      setState(prev => ({
        ...prev,
        charLimits: { ...prev.charLimits, mastodon: limit }
      }));
    });
  }, []);

  // Handle keyboard input
  useInput((input: string, key: any) => {
    // Tab navigation when not editing
    if (key.tab && !state.isEditing) {
      const fields: FocusedField[] = ['text', 'backlink', 'mastodon', 'bluesky', 'submit', 'cancel'];
      const currentIndex = fields.indexOf(state.focusedField);

      // Shift+Tab navigates backwards, Tab navigates forwards
      const nextIndex = key.shift
        ? (currentIndex - 1 + fields.length) % fields.length
        : (currentIndex + 1) % fields.length;

      setState(prev => ({ ...prev, focusedField: fields[nextIndex] }));
      return;
    }

    // Enter key behavior
    if (key.return && !state.isEditing) {
      if (state.focusedField === 'text') {
        setState(prev => ({ ...prev, isEditing: true }));
      } else if (state.focusedField === 'backlink') {
        setState(prev => ({
          ...prev,
          includeBacklink: !prev.includeBacklink
        }));
      } else if (state.focusedField === 'mastodon') {
        setState(prev => ({
          ...prev,
          platforms: { ...prev.platforms, mastodon: !prev.platforms.mastodon }
        }));
      } else if (state.focusedField === 'bluesky') {
        setState(prev => ({
          ...prev,
          platforms: { ...prev.platforms, bluesky: !prev.platforms.bluesky }
        }));
      } else if (state.focusedField === 'submit') {
        handleSubmit();
      } else if (state.focusedField === 'cancel') {
        onCancel();
        exit();
      }
      return;
    }

    // Escape key - exit text editing or cancel
    if (key.escape) {
      if (state.isEditing) {
        setState(prev => ({ ...prev, isEditing: false }));
      } else {
        onCancel();
        exit();
      }
      return;
    }
  });

  const handleSubmit = async () => {
    if (!state.platforms.mastodon && !state.platforms.bluesky) {
      return;
    }

    await onSubmit({
      content: state.postText,
      platforms: state.platforms,
      includeBacklink: state.includeBacklink,
    });
    exit();
  };

  // Calculate preview content for each platform
  const link = state.includeBacklink ? backlink : undefined;
  const mastodonPreview = truncateContent(
    state.postText,
    state.charLimits.mastodon,
    link
  );
  const blueskyPreview = truncateContent(
    state.postText,
    state.charLimits.bluesky,
    link
  );

  return (
    <Box flexDirection="column" padding={1}>
      {/* Header */}
      <Box marginBottom={1}>
        <Text bold color="cyan">Cross-Post to Social Media</Text>
      </Box>

      {/* Instructions */}
      <Box marginBottom={1}>
        <Text dimColor>
          Tab: Next | Shift+Tab: Previous | Enter: Select/Edit | Esc: Cancel/Exit Edit
        </Text>
      </Box>

      {/* Post Text Editor */}
      <Box flexDirection="column" marginBottom={1}>
        <Text>
          {state.focusedField === 'text' ? '> ' : '  '}
          <Text color={state.focusedField === 'text' ? 'green' : undefined}>
            Post Text:
          </Text>
        </Text>
        <Box marginLeft={2}>
          {state.isEditing && state.focusedField === 'text' ? (
            <TextInput
              value={state.postText}
              onChange={(value: string) => setState(prev => ({ ...prev, postText: value }))}
              onSubmit={() => setState(prev => ({ ...prev, isEditing: false }))}
            />
          ) : (
            <Text>{state.postText}</Text>
          )}
        </Box>
      </Box>

      {/* Backlink Toggle */}
      <Box marginBottom={1}>
        <Text>
          {state.focusedField === 'backlink' ? '> ' : '  '}
          <Text color={state.focusedField === 'backlink' ? 'green' : undefined}>
            [{state.includeBacklink ? 'X' : ' '}] Include backlink
          </Text>
        </Text>
      </Box>

      {/* Platform Selection */}
      <Box flexDirection="column" marginBottom={1}>
        <Text bold>Platforms:</Text>
        <Box marginLeft={2}>
          <Text>
            {state.focusedField === 'mastodon' ? '> ' : '  '}
            <Text color={state.focusedField === 'mastodon' ? 'green' : undefined}>
              [{state.platforms.mastodon ? 'X' : ' '}] Mastodon
            </Text>
          </Text>
        </Box>
        <Box marginLeft={2}>
          <Text>
            {state.focusedField === 'bluesky' ? '> ' : '  '}
            <Text color={state.focusedField === 'bluesky' ? 'green' : undefined}>
              [{state.platforms.bluesky ? 'X' : ' '}] Bluesky
            </Text>
          </Text>
        </Box>
      </Box>

      {/* Preview Section */}
      <Box flexDirection="column" marginBottom={1} borderStyle="single" borderColor="gray">
        <Text bold>Preview:</Text>

        {state.platforms.mastodon && (
          <Box flexDirection="column" marginTop={1}>
            <Text color="blue" bold>Mastodon:</Text>
            <Text>{mastodonPreview}</Text>
            <Text dimColor>
              Characters: {mastodonPreview.length}/{state.charLimits.mastodon}
            </Text>
          </Box>
        )}

        {state.platforms.bluesky && (
          <Box flexDirection="column" marginTop={1}>
            <Text color="cyan" bold>Bluesky:</Text>
            <Text>{blueskyPreview}</Text>
            <Text dimColor>
              Characters: {blueskyPreview.length}/{state.charLimits.bluesky}
            </Text>
          </Box>
        )}

        {!state.platforms.mastodon && !state.platforms.bluesky && (
          <Text color="red">No platforms selected!</Text>
        )}
      </Box>

      {/* Action Buttons */}
      <Box>
        <Box marginRight={2}>
          <Text
            color={state.focusedField === 'submit' ? 'green' : undefined}
            bold={state.focusedField === 'submit'}
          >
            {state.focusedField === 'submit' ? '> ' : '  '}[Submit]
          </Text>
        </Box>
        <Box>
          <Text
            color={state.focusedField === 'cancel' ? 'red' : undefined}
            bold={state.focusedField === 'cancel'}
          >
            {state.focusedField === 'cancel' ? '> ' : '  '}[Cancel]
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default CrossPostUI;
