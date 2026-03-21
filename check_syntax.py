import ast
import os
import traceback
import sys

print('--- Syntax Check ---')
for root, dirs, files in os.walk('.'):
    if 'venv' in root or '.git' in root: continue
    for f in files:
        if f.endswith('.py'):
            path = os.path.join(root, f)
            try:
                with open(path, 'r', encoding='utf-8') as file:
                    source = file.read()
                ast.parse(source, filename=path)
            except SyntaxError as e:
                print(f"SyntaxError in {path}: {e.msg} at line {e.lineno}")
            except IndentationError as e:
                print(f"IndentationError in {path}: {e.msg} at line {e.lineno}")
            except Exception as e:
                print(f"Error reading {path}: {e}")

print('\n--- Import Check ---')
try:
    import src.api.server
    print('src.api.server imported successfully')
except Exception as e:
    print('Import error in src.api.server:')
    traceback.print_exc(file=sys.stdout)

# Removed ui.app import check - transitioned to Next.js frontend
print('Next.js frontend (ui/argus-lite-ui/) - no Python imports to check')
