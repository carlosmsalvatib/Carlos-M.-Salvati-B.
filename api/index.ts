import { initialCmsContent } from '../src/data/initialContent';
import { initialLots } from '../src/data/initialLots';

export default function handler(req: any, res: any) {
  res.status(200).json({
    success: true,
    hasContent: !!initialCmsContent,
    siteTitle: initialCmsContent?.site?.title,
    lotsCount: initialLots?.length,
  });
}
