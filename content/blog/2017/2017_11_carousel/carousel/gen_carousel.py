import os, fnmatch

for root, dirs, files in os.walk('.'):
    for filename in files:
        if fnmatch.fnmatch(filename, '*.jpg'):
            print('<a href="{}/images/2017/carousel/{}" data-lightbox="carousel" data-title="{}"></a>'.format('{static}', filename, filename))
