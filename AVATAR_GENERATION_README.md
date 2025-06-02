# Character Avatar Generation

This project now includes dynamically generated avatars for Mike, Carson, and Ava characters.

## How the Avatars Work

The avatars are generated using HTML5 Canvas API and are embedded directly in the application as base64 data URLs. This means:
- No external image files needed
- Avatars are generated on-the-fly when the game loads
- Consistent style across all characters
- Easy to modify or customize

## Character Descriptions

### Mike
- **Appearance**: Brown hair, green eyes, athletic build
- **Theme Color**: Brown (#8B4513)
- **Outfit**: Blue fitness tank top
- **Role**: Fitness enthusiast

### Carson
- **Appearance**: Blonde styled hair, blue eyes, confident expression
- **Theme Color**: Royal Blue (#4169E1)
- **Outfit**: Red athletic compression shirt with number 7
- **Role**: Athletic champion

### Ava
- **Appearance**: Long auburn hair, hazel eyes, friendly smile
- **Theme Color**: Chocolate (#D2691E)
- **Outfit**: Purple yoga outfit with yoga symbol
- **Role**: Yoga instructor

## Viewing the Avatars

To see all generated avatars in a preview page:
1. Run the development server: `npm run dev`
2. Navigate to: `http://localhost:8080/?avatars=true`
3. You can download the avatars as PNG files from this page

## Technical Implementation

The avatars are generated using:
- `/src/utils/generateAvatars.ts` - Core avatar generation logic
- `/src/utils/characterAvatars.ts` - Avatar data management
- Canvas 2D API for drawing shapes, gradients, and details

Each avatar is 200x200 pixels and includes:
- Distinctive facial features
- Character-appropriate clothing
- Theme colors matching their game sections
- Professional fitness center attire

## Customization

To modify an avatar:
1. Edit the respective drawing function in `generateAvatars.ts`
2. The changes will be reflected immediately when the game loads
3. No need to regenerate or save image files

## Integration

The avatars are automatically loaded in `Index.tsx` using:
```typescript
const mikeImage = new Image();
mikeImage.src = generateAvatarDataURL('mike');
```

This approach ensures the avatars are always available and don't require external file management.