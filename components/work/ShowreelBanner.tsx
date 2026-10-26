"use client";

import Image from "next/image";
import ShowreelModal from "@/components/work/ShowreelModal";
import Icon from "@/components/ui/Icon";

export default function ShowreelBanner({ image }: { image: string }) {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-white/[0.07] group">
      <Image
        src={image}
        alt="Cinematic collage of futuristic media productions"
        fill
        sizes="(max-width: 1024px) 100vw, 50vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-transparent" />
      <ShowreelModal
        className="absolute inset-0 flex items-center justify-center cursor-pointer"
        iconOverride={
          <span className="flex items-center justify-center w-16 h-16 rounded-full bg-primary-container text-on-primary-fixed shadow-[0_0_36px_rgba(0,229,255,0.8)] group-hover:scale-105 transition-transform">
            <Icon name="play_arrow" className="text-display-lg-mobile" filled />
          </span>
        }
      />
    </div>
  );
}
