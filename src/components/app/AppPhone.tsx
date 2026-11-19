import Phone from "./Phone";
import { SCREENS, type ScreenName } from "./screens";
import { useI18n } from "../../i18n";

type Props = {
  screen: ScreenName;
  size?: "sm" | "md" | "lg";
  withCaption?: boolean;
  className?: string;
};

/** A device showing one named screen, with its caption. */
export default function AppPhone({ screen, size = "md", withCaption = true, className }: Props) {
  const { t } = useI18n();
  const { Screen, tab, meta, path } = SCREENS[screen];
  const title = t(`${path}.title`, meta.title);

  return (
    <Phone
      tab={tab}
      size={size}
      className={className}
      label={`${title} - interface design concept for the Aswenna application`}
      caption={withCaption ? { title, text: t(`${path}.caption`, meta.caption) } : undefined}
    >
      <Screen />
    </Phone>
  );
}
