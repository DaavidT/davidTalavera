import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

interface GalleryImage {
  src: string;
  alt: string;
  id: string;
  caption?: string;
}

interface ProjectGalleryProps {
  images: GalleryImage[];
}

export default function ProjectGallery({ images }: ProjectGalleryProps) {
  return (
    <Carousel
      className="w-full overflow-hidden"
      opts={{
        align: 'start',
        loop: true,
      }}
    >
      <CarouselContent className="-ml-1 not-prose">
        {images.map((image, index) => (
          <CarouselItem key={index} className="pl-1 relative">
            <div>
              <Card>
                <CardContent>
                  <AspectRatio ratio={16 / 9} className="h-full w-full">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="h-full w-full rounded-md object-contain"
                      width={600}
                      height={600}
                    />
                  </AspectRatio>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 md:left-2" />
      <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 md:right-2" />
    </Carousel>
  );
}
