#!/bin/bash

# Ask for destination folder
read -p "Enter destination folder (default: src/components): " folder

# Set default folder if none provided
if [ -z "$folder" ]; then
 folder="src/components"
fi

# Check if destination folder exists
if [ ! -d "$folder" ]; then
 echo -e "\033[0;31mDestination folder doesn't exist\033[0m"
 exit 1
fi

# Ask for component name
read -p "Enter component name: " name

# Convert component name to camelCase
classname=$(echo "$name" | sed -r 's/(^|)([a-z])/\U\2/g; s///g')
# Convert the first letter to lowercase
componentNameLowercase="$(echo ${classname:0:1} | tr '[:upper:]' '[:lower:]')${classname:1}"

# Create component folder
mkdir -p "$folder/$name"

# Create component files
touch "$folder/$name/$name.tsx"
touch "$folder/$name/i$name.ts"
touch "$folder/$name/index.ts"

# Write to component files
echo "import cn from 'classnames';" >> "$folder/$name/$name.tsx"
echo "" >> "$folder/$name/$name.tsx"
echo "import {i${classname}Props} from './i${name}';" >> "$folder/$name/$name.tsx"
echo "" >> "$folder/$name/$name.tsx"
echo "function ${name}({className} : i${classname}Props) {" >> "$folder/$name/$name.tsx"
echo " return (" >> "$folder/$name/$name.tsx"
echo "  <div className={cn(className)}>" >> "$folder/$name/$name.tsx"
echo "   ${name}" >> "$folder/$name/$name.tsx"
echo "  </div>" >> "$folder/$name/$name.tsx"
echo " );" >> "$folder/$name/$name.tsx"
echo "}" >> "$folder/$name/$name.tsx"
echo "" >> "$folder/$name/$name.tsx"
echo "export default ${name};" >> "$folder/$name/$name.tsx"

echo "export interface i${classname}Props {" >> "$folder/$name/i$name.ts"
echo "  className?: string;" >> "$folder/$name/i$name.ts"
echo "}" >> "$folder/$name/i$name.ts"

echo "export { default as ${name} } from './${name}';" >> "$folder/$name/index.ts"
echo "export * from './i${name}';" >> "$folder/$name/index.ts"

# Update the index.ts file in the component folder or create a new one
indexFile="$folder/index.ts"
if [ -f "$indexFile" ]; then
 echo "export * from './$name';" >> "$indexFile"
else
 touch "$indexFile"
 echo "export * from './$name';" >> "$indexFile"
fi

echo "Component created successfully!"