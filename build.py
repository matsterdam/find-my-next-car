# Builds find-my-next-car.html from template.html + engine.js + next.js (run from this folder).
t = open('template.html').read()
out = t.replace('/*ENGINE*/', open('engine.js').read()).replace('/*NEXT*/', open('next.js').read())
open('find-my-next-car.html', 'w').write(out)
print('built find-my-next-car.html', len(out), 'bytes')

# Standalone copy for static hosting (GitHub Pages serves index.html). The artifact viewer wraps the
# page in its own skeleton; a file opened or hosted on its own needs one.
k = out.index('</style>') + len('</style>')
head, body = out[:k], out[k:]
open('index.html', 'w').write(
    '<!doctype html>\n<html lang="en"><head><meta charset="utf-8">'
    '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'
    + head + '\n<style>body{margin:0}img{max-width:100%}</style>\n</head><body>' + body + '\n</body></html>\n')
print('built index.html')
