import { useTranslation } from "next-i18next";
import { useBlockPages } from "../hooks/useBlockPages";
import { Validator } from "../models/validator";
import { BlockFeed } from "./blocks/block-feed";
import { Card } from "./ui/card";
import { DetailGrid, DetailList, DetailRow } from "./ui/detail-list";
import { Hash } from "./ui/hash";
import { PageHeader } from "./ui/page-header";
import { SectionHeader } from "./ui/section-header";
import { ValidatorStatusPill, validatorDisplayName } from "./validators/validator-table";
import layout from "./ui/detail-layout.module.scss";

interface Props {
  validator: Validator;
}

export const ValidatorDetail = ({ validator }: Props) => {
  const { t } = useTranslation(["validator", "common"]);
  const name = validatorDisplayName(validator);
  const feed = useBlockPages({ params: { master_node: validator.address } });

  return (
    <>
      <PageHeader
        title={name ?? validator.uniqueNameLabel}
        badges={<ValidatorStatusPill validator={validator} size="md" />}
        meta={[validator.locationLabel !== "-" ? validator.locationLabel : null, `${t("validator:detail.connected")} ${validator.dateLabel}`]}
      />

      <Card as="section" aria-label={t("validator:detail.heading") as string}>
        <DetailList>
          <DetailRow label={t("validator:detail.fields.address")} stacked>
            <Hash value={validator.address} full tone="strong" />
          </DetailRow>
          <DetailGrid>
            <DetailRow label={t("validator:detail.fields.name")} stacked>
              {name ?? "—"}
            </DetailRow>
            <DetailRow label={t("validator:detail.fields.status")} stacked>
              <ValidatorStatusPill validator={validator} />
            </DetailRow>
            <DetailRow label={t("validator:detail.fields.location")} stacked>
              {validator.locationLabel}
            </DetailRow>
            <DetailRow label={t("validator:detail.fields.connectionDate")} stacked>
              {validator.dateLabel}
            </DetailRow>
            <DetailRow label={t("validator:detail.fields.blocksCrafted")} stacked mono>
              {Number.isFinite(validator.blockCount) ? validator.blockCount.toLocaleString() : "—"}
            </DetailRow>
          </DetailGrid>
        </DetailList>
      </Card>

      <SectionHeader title={t("validator:detail.blocksHeading")} description={t("validator:detail.blocksDescription")} className={layout.section} />
      <BlockFeed blocks={feed.blocks} loadMore={feed.loadMore} canLoadMore={feed.canLoadMore} loading={!feed.loaded} emptyLabel={t("validator:detail.noBlocks") as string} />
    </>
  );
};
