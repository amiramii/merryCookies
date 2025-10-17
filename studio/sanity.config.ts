import { defineConfig } from 'sanity';
import { deskTool } from 'sanity/desk'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas';

export default defineConfig({
  projectId: '3tusbazs',
  dataset: 'production',
  apiVersion: '2024-01-01',
  title: 'Merry Cookies Studio',
  plugins: [deskTool(), structureTool(), visionTool()],
  schema: {
    types: schemaTypes,
  },
});
