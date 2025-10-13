package com.propertymgmt.property.service.impl;

import com.propertymgmt.property.model.FeeBill;
import com.propertymgmt.property.repository.FeeBillRepository;
import com.propertymgmt.property.service.FeeService;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class FeeServiceImpl implements FeeService {

    private final FeeBillRepository feeBillRepository;

    public FeeServiceImpl(FeeBillRepository feeBillRepository) {
        this.feeBillRepository = feeBillRepository;
    }

    @Override
    public List<FeeBill> findAll() {
        return feeBillRepository.findAll();
    }
}
