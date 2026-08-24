package com.ticketbooking.config;

import org.hibernate.community.dialect.SQLiteDialect;
import org.hibernate.tool.schema.extract.spi.SequenceInformationExtractor;
import org.hibernate.tool.schema.extract.internal.SequenceInformationExtractorNoOpImpl;

public class CustomSQLiteDialect extends SQLiteDialect {
    @Override
    public SequenceInformationExtractor getSequenceInformationExtractor() {
        return SequenceInformationExtractorNoOpImpl.INSTANCE;
    }
}
